/**
 * three.js renderer for the medusa graph: additive point sprites, thin
 * parent edges and an afterimage trail. Positions arrive from the layout
 * worker, this module only draws. Slots are fixed GPU buffer indices, a node
 * keeps its slot until its fade out has finished.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  Points,
  LineSegments,
  ShaderMaterial,
  AdditiveBlending,
  Color,
  Vector3,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { makeSpriteTexture } from './sprite.js';
import { GROUPS } from './groups.js';
import { ENGINE_DEFAULTS } from './defaults.js';

const FREE_BIRTH = 1e9;

const POINT_VERT = `
attribute vec3 color;
attribute float size;
attribute float birth;
attribute float death;
attribute float highlight;
uniform float uTime;
uniform float uOpacity;
uniform float uPixelRatio;
uniform float uFlash;
uniform float uFadeOut;
uniform float uDim;
uniform float uHasHighlight;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float age = uTime - birth;
  float a = smoothstep(0.0, uFlash, age);
  if (death >= 0.0) a *= 1.0 - smoothstep(0.0, uFadeOut, uTime - death);
  float flash = 1.0 - smoothstep(0.0, uFlash, age);
  vColor = mix(color, vec3(1.0), flash * 0.9);
  float dim = mix(1.0, mix(uDim, 1.0, highlight), uHasHighlight);
  vAlpha = a * uOpacity * dim;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (1.0 + flash * 1.5) * uPixelRatio * (900.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const POINT_FRAG = `
uniform sampler2D uSprite;
uniform float uAlpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float s = texture2D(uSprite, gl_PointCoord).a;
  gl_FragColor = vec4(vColor, s * vAlpha * uAlpha);
}
`;

const LINE_VERT = `
attribute vec3 color;
attribute float alpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vColor = color;
  vAlpha = alpha;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LINE_FRAG = `
uniform float uLineAlpha;
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  gl_FragColor = vec4(vColor, vAlpha * uLineAlpha * uOpacity);
}
`;

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function createEngine({ canvas, mode = 'ambient', capacity = 4096, reducedMotion = false }) {
  const params = { ...ENGINE_DEFAULTS };
  const groupColors = GROUPS.map((g) => new Color(g.color).convertLinearToSRGB());

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(new Color(params.background), 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 1, 20000);

  // Per slot state
  const position = new Float32Array(capacity * 3);
  const target = new Float32Array(capacity * 2);
  const color = new Float32Array(capacity * 3);
  const size = new Float32Array(capacity);
  const birth = new Float32Array(capacity).fill(FREE_BIRTH);
  const death = new Float32Array(capacity).fill(-1);
  const highlight = new Float32Array(capacity);
  const nodeAtSlot = new Array(capacity).fill(null);
  const slotOf = new Map();
  const freeSlots = [];
  for (let i = capacity - 1; i >= 0; i -= 1) freeSlots.push(i);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  for (let i = 0; i < capacity; i += 1) position[3 * i + 2] = rand() * params.zSpread;

  const pointGeo = new BufferGeometry();
  pointGeo.setAttribute('position', new BufferAttribute(position, 3));
  pointGeo.setAttribute('color', new BufferAttribute(color, 3));
  pointGeo.setAttribute('size', new BufferAttribute(size, 1));
  pointGeo.setAttribute('birth', new BufferAttribute(birth, 1));
  pointGeo.setAttribute('death', new BufferAttribute(death, 1));
  pointGeo.setAttribute('highlight', new BufferAttribute(highlight, 1));
  const pointMat = new ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uFlash: { value: params.flashDuration },
      uFadeOut: { value: params.fadeOutDuration },
      uDim: { value: params.dimFactor },
      uHasHighlight: { value: 0 },
      uSprite: { value: makeSpriteTexture() },
      uAlpha: { value: params.pointAlpha },
    },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const points = new Points(pointGeo, pointMat);
  points.frustumCulled = false;
  scene.add(points);

  const linePos = new Float32Array(capacity * 2 * 3);
  const lineColor = new Float32Array(capacity * 2 * 3);
  const lineAlpha = new Float32Array(capacity * 2);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new BufferAttribute(lineColor, 3));
  lineGeo.setAttribute('alpha', new BufferAttribute(lineAlpha, 1));
  const lineMat = new ShaderMaterial({
    vertexShader: LINE_VERT,
    fragmentShader: LINE_FRAG,
    uniforms: { uLineAlpha: { value: params.lineAlpha }, uOpacity: { value: 1 } },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  scene.add(lines);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const afterimage = new AfterimagePass(params.trailDamp);
  afterimage.enabled = !reducedMotion;
  composer.addPass(afterimage);

  let time = 0;
  let opacity = 1;
  const pointer = { x: 0, y: 0 };
  const view = { distance: params.cameraDistance, panX: 0, panY: 0 };
  let highlightGroup = -1;
  let highlightSet = null;
  const fading = [];
  const tmp = new Vector3();

  // A highlight is active while an era chip or a pinned subtree is set, and
  // then everything outside it is dimmed.
  const highlightActive = () => highlightGroup >= 0 || highlightSet !== null;
  const isHighlighted = (node) =>
    (highlightGroup >= 0 && node.group === highlightGroup) || (highlightSet !== null && highlightSet.has(node.id));

  const clampDistance = (distance) => Math.min(params.maxDistance, Math.max(params.minDistance, distance));

  function nodeAlpha(slot) {
    let a = smoothstep(0, params.flashDuration, time - birth[slot]);
    if (death[slot] >= 0) a *= 1 - smoothstep(0, params.fadeOutDuration, time - death[slot]);
    if (highlightActive()) a *= highlight[slot] ? 1 : params.dimFactor;
    return a;
  }

  function recomputeHighlight() {
    const active = highlightActive();
    for (let s = 0; s < capacity; s += 1) {
      const node = nodeAtSlot[s];
      highlight[s] = node && active && isHighlighted(node) ? 1 : 0;
    }
    pointMat.uniforms.uHasHighlight.value = active ? 1 : 0;
    pointGeo.attributes.highlight.needsUpdate = true;
  }

  function lookTarget() {
    if (mode !== 'ambient') return { x: view.panX, y: view.panY };
    const aspect = camera.aspect;
    const portrait = aspect < 1;
    const visibleWidth = 2 * view.distance * Math.tan((camera.fov * Math.PI) / 360) * aspect;
    return { x: portrait ? 0 : params.ambientOffsetX * visibleWidth, y: 0 };
  }

  function updateCamera() {
    const look = lookTarget();
    camera.position.set(look.x + pointer.x * params.parallax, look.y + pointer.y * params.parallax, view.distance);
    camera.lookAt(look.x, look.y, 0);
  }

  function screenOf(slot, width, height) {
    camera.updateMatrixWorld();
    tmp.set(position[3 * slot], position[3 * slot + 1], position[3 * slot + 2]).project(camera);
    return { x: ((tmp.x + 1) / 2) * width, y: ((1 - tmp.y) / 2) * height };
  }

  return {
    addNode(node) {
      if (slotOf.has(node.id)) return;
      const slot = freeSlots.pop();
      if (slot === undefined) return;
      slotOf.set(node.id, slot);
      nodeAtSlot[slot] = node;
      const parentSlot = node.parent === -1 ? undefined : slotOf.get(node.parent);
      const px = parentSlot === undefined ? 0 : position[3 * parentSlot];
      const py = parentSlot === undefined ? 0 : position[3 * parentSlot + 1];
      position[3 * slot] = px;
      position[3 * slot + 1] = py;
      target[2 * slot] = px;
      target[2 * slot + 1] = py;
      const c = groupColors[node.group] || groupColors[groupColors.length - 1];
      color[3 * slot] = c.r;
      color[3 * slot + 1] = c.g;
      color[3 * slot + 2] = c.b;
      size[slot] = node.isDir ? params.pointSizeDir : params.pointSizeFile;
      birth[slot] = time;
      death[slot] = -1;
      highlight[slot] = highlightActive() && isHighlighted(node) ? 1 : 0;
      pointGeo.attributes.color.needsUpdate = true;
      pointGeo.attributes.size.needsUpdate = true;
      pointGeo.attributes.birth.needsUpdate = true;
      pointGeo.attributes.death.needsUpdate = true;
      pointGeo.attributes.highlight.needsUpdate = true;
    },
    removeNode(id) {
      const slot = slotOf.get(id);
      if (slot === undefined) return;
      slotOf.delete(id);
      death[slot] = time;
      fading.push(slot);
      pointGeo.attributes.death.needsUpdate = true;
    },
    updatePositions(ids, xy) {
      for (let i = 0; i < ids.length; i += 1) {
        const slot = slotOf.get(ids[i]);
        if (slot === undefined) continue;
        target[2 * slot] = xy[2 * i];
        target[2 * slot + 1] = xy[2 * i + 1];
      }
    },
    setHighlightGroup(index) {
      highlightGroup = index;
      recomputeHighlight();
    },
    setHighlightSet(set) {
      highlightSet = set;
      recomputeHighlight();
    },
    setOpacity(o) {
      opacity = o;
    },
    setPointer(nx, ny) {
      pointer.x = nx;
      pointer.y = ny;
    },
    setView(next) {
      Object.assign(view, next);
      view.distance = clampDistance(view.distance);
    },
    getView: () => ({ ...view }),
    pick(px, py) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      let best = null;
      let bestDist = Infinity;
      slotOf.forEach((slot, id) => {
        const s = screenOf(slot, width, height);
        const radius = nodeAtSlot[slot].isDir ? 16 : 11;
        const d = Math.hypot(s.x - px, s.y - py);
        if (d < radius && d < bestDist) {
          bestDist = d;
          best = id;
        }
      });
      return best;
    },
    project(id) {
      const slot = slotOf.get(id);
      if (slot === undefined) return null;
      return screenOf(slot, canvas.clientWidth, canvas.clientHeight);
    },
    render(dt) {
      time += dt;
      const k = Math.min(1, dt * params.smoothing);
      for (let s = 0; s < capacity; s += 1) {
        if (birth[s] === FREE_BIRTH) continue;
        position[3 * s] += (target[2 * s] - position[3 * s]) * k;
        position[3 * s + 1] += (target[2 * s + 1] - position[3 * s + 1]) * k;
      }
      // Free slots whose fade out finished
      for (let i = fading.length - 1; i >= 0; i -= 1) {
        const slot = fading[i];
        if (time - death[slot] > params.fadeOutDuration) {
          fading.splice(i, 1);
          nodeAtSlot[slot] = null;
          birth[slot] = FREE_BIRTH;
          death[slot] = -1;
          freeSlots.push(slot);
        }
      }
      // Edges: one per slot, from node to its parent
      for (let s = 0; s < capacity; s += 1) {
        const node = nodeAtSlot[s];
        const parentSlot = node && node.parent !== -1 ? slotOf.get(node.parent) : undefined;
        const v = 6 * s;
        if (!node || parentSlot === undefined) {
          lineAlpha[2 * s] = 0;
          lineAlpha[2 * s + 1] = 0;
          continue;
        }
        linePos[v] = position[3 * s];
        linePos[v + 1] = position[3 * s + 1];
        linePos[v + 2] = position[3 * s + 2];
        linePos[v + 3] = position[3 * parentSlot];
        linePos[v + 4] = position[3 * parentSlot + 1];
        linePos[v + 5] = position[3 * parentSlot + 2];
        for (let c = 0; c < 3; c += 1) {
          lineColor[v + c] = color[3 * s + c];
          lineColor[v + 3 + c] = color[3 * parentSlot + c];
        }
        const a = Math.min(nodeAlpha(s), nodeAlpha(parentSlot));
        lineAlpha[2 * s] = a;
        lineAlpha[2 * s + 1] = a;
      }
      pointGeo.attributes.position.needsUpdate = true;
      pointGeo.attributes.birth.needsUpdate = true;
      pointGeo.attributes.death.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.attributes.alpha.needsUpdate = true;
      pointMat.uniforms.uTime.value = time;
      pointMat.uniforms.uOpacity.value = opacity;
      lineMat.uniforms.uOpacity.value = opacity;
      updateCamera();
      composer.render();
    },
    resize() {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      const ratio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      composer.setPixelRatio(ratio);
      composer.setSize(width, height);
      pointMat.uniforms.uPixelRatio.value = ratio;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    setParams(next) {
      Object.assign(params, next);
      renderer.setClearColor(new Color(params.background), 1);
      pointMat.uniforms.uFlash.value = params.flashDuration;
      pointMat.uniforms.uFadeOut.value = params.fadeOutDuration;
      pointMat.uniforms.uDim.value = params.dimFactor;
      pointMat.uniforms.uAlpha.value = params.pointAlpha;
      lineMat.uniforms.uLineAlpha.value = params.lineAlpha;
      afterimage.uniforms.damp.value = params.trailDamp;
      if (next.cameraDistance !== undefined) view.distance = clampDistance(params.cameraDistance);
      for (let s = 0; s < capacity; s += 1) {
        const node = nodeAtSlot[s];
        if (node) size[s] = node.isDir ? params.pointSizeDir : params.pointSizeFile;
      }
      pointGeo.attributes.size.needsUpdate = true;
    },
    dispose() {
      scene.remove(points);
      scene.remove(lines);
      pointGeo.dispose();
      lineGeo.dispose();
      pointMat.uniforms.uSprite.value.dispose();
      pointMat.dispose();
      lineMat.dispose();
      afterimage.dispose();
      renderPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
