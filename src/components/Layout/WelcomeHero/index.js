import React, { useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

//Webgl Imports
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

class SceneBuilder {
  constructor() {
    this.container = document.getElementById("webgl_container");
    this.render = this.render.bind(this);
    this.colors = {
      lightBlue: new THREE.Color(0x0044e3),
      white: new THREE.Color(0xffffff),
    };
  }

  build() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      transparent: true,
    });

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.handleResize();

    this.container.appendChild(this.renderer.domElement);
  }

  render() {
    if (this.rotate) {
      this?.main.rotateZ(0.001);
    }
    this.camera.updateMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener("resize", () => {
      //If React decides to change the div ref all of a sudden...
      const current = document.getElementById("webgl_container");
      this.camera.aspect = current.clientWidth / current.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(current.clientWidth, current.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });
  }

  loadLights() {
    const directional = new THREE.DirectionalLight(this.colors.white, 10);
    const ambient = new THREE.AmbientLight(this.colors.lightBlue, 6);
    this.scene.add(ambient, directional);
  }

  async loadCardano() {
    const loader = new SVGLoader();
    const loaded = await loader.loadAsync(
      "/img/brand-assets/cardano-webgl.svg"
    );

    const group = new THREE.Group();

    const material = new THREE.MeshLambertMaterial({
      color: this.colors.white,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    for (const path of loaded.paths) {
      const shapes = SVGLoader.createShapes(path);

      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 3,
          bevelEnabled: true,
        });

        const mesh = new THREE.Mesh(geometry, material);

        group.add(mesh);
      }
    }

    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);

    const yOffset = size.y / -2;
    const xOffset = size.x / -2;

    for (const child of group.children) {
      child.position.x = xOffset;
      child.position.y = yOffset;
    }

    group.scale.y *= -1;
    group.scale.set(0.18, 0.18, 0.18);
    group.rotateX(-1);
    group.rotateY(-0.6);
    group.position.setX(this.container.clientWidth < 996 ? 10 : 20);
    group.position.y += this.container.clientWidth < 996 ? 5 : 2;

    this.main = group;
    this.rotate = true;
    this.scene.add(group);
  }
}

function WelcomeHero({ title, description }) {
  useEffect(() => {
    const initScene = async () => {
      const builder = new SceneBuilder();
      builder.build();
      builder.loadLights();
      await builder.loadCardano();

      const animate = () => {
        requestAnimationFrame(animate);
        builder.render();
      };
      animate();
    };

    initScene();
  }, []);

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.mobileOverlay} />
      <div className={styles.webglContainer} id="webgl_container" />

      <div className={styles.ctaContainer}>
        <div className={styles.taglineContainer}>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{description}</p>
          <div className={styles.cta}>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.button
              )}
              to="/where-to-get-ada"
            >
              Where to get ada?
            </Link>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.button
              )}
              to="/developers"
            >
              Start Building
            </Link>
          </div>
        </div>

        <div className="sectionCaret">
          <svg x="0px" y="0px" viewBox="0 0 2000 30">
            <polygon
              className="polygon-fill"
              points="1000,30 0,30 0,0 980,0 "
            ></polygon>
            <polygon
              className="polygon-fill"
              points="1000,30 2000,30 2000,0 1020,0 "
            ></polygon>
          </svg>
        </div>
      </div>
    </header>
  );
}

export default WelcomeHero;
