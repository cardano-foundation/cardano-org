import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import p5 from "p5";

function WelcomeHero({ title, description }) {
  const canvasRef = useRef();

  useEffect(() => {
    let nodes = [];
    let numParticles = 100;
    let gravityStrength = 0.001;
    let nodeSizeFactor = 1;
    let nodeSpeedFactor = 1;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 800).parent(canvasRef.current);

        for (let i = 0; i < numParticles; i++) {
          let objectType = p.random(["node", "lightbulb", "leaf", "shape"]);
          let node = {
            x: p.random(p.width / 2, p.width),
            targetX: p.random(p.width / 2, p.width),
            targetY: p.random(p.height),
            size: p.random(10, 30) * nodeSizeFactor,
            color: p.random() > 0.5 ? p.color("#FF5553") : p.color("#FFFFFF"),
            opacity: 0,
            speedX: p.random(-0.5, 0.5) * nodeSpeedFactor,
            speedY: p.random(-0.5, 0.5) * nodeSpeedFactor,
            angle: p.random(p.TWO_PI),
            rotationSpeed: p.random(-0.05, 0.05),
            type: objectType,
            startTime: p.millis(),
            isPoppedUp: false,
          };
          nodes.push(node);
        }
      };

      p.draw = () => {
        let inter = p.map(p.mouseX, 0, p.width, 0, 1);
        let c = p.lerpColor(p.color("#0033AD99"), p.color("#3B798299"), inter);
        p.background(c);

        drawSustainability();

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let elapsedTime = p.millis() - node.startTime;
          let popDuration = 2000;

          node.x = p.lerp(node.x, node.targetX, 0.05);
          node.y = p.lerp(node.y, node.targetY, 0.05);

          node.opacity = p.map(elapsedTime, 0, popDuration, 0, 255);

          if (elapsedTime >= popDuration && !node.isPoppedUp) {
            node.isPoppedUp = true;
          }

          let forceX = (p.mouseX - node.x) * gravityStrength;
          let forceY = (p.mouseY - node.y) * gravityStrength;

          node.x += node.speedX + forceX;
          node.y += node.speedY + forceY;

          if (node.x > p.width || node.x < p.width / 2) node.speedX *= -1;
          if (node.y > p.height || node.y < 0) node.speedY *= -1;

          node.color = p.lerpColor(
            node.color,
            p.random() > 0.5 ? p.color("#FF5553") : p.color("#FFFFFF"),
            0.002
          );

          node.angle += node.rotationSpeed;

          p.fill(node.color.levels[0], node.color.levels[1], node.color.levels[2], node.opacity);
          p.noStroke();
          p.push();
          p.translate(node.x, node.y);
          p.rotate(node.angle);

          if (node.type === "lightbulb") {
            p.ellipse(0, 0, node.size);
            p.stroke(255, 255, 0, 100);
            p.noFill();
            p.ellipse(0, 0, node.size * 1.5);
          } else if (node.type === "leaf") {
            p.beginShape();
            p.vertex(0, -node.size / 2);
            p.bezierVertex(-node.size / 2, 0, node.size / 2, 0, 0, node.size / 2);
            p.endShape(p.CLOSE);
          } else if (node.type === "shape") {
            p.rect(-node.size / 2, -node.size / 2, node.size, node.size);
          } else {
            p.ellipse(0, 0, node.size);
          }
          p.pop();
        }
      };

      function drawSustainability() {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let angle = p.map(i, 0, nodes.length, 0, p.TWO_PI);
          node.x = p.width / 2 + p.cos(angle) * 200;
          node.y = p.height / 2 + p.sin(angle) * 200;

          let trailAlpha = p.map(i, 0, nodes.length, 50, 150);
          p.stroke(255, trailAlpha);
          p.line(node.x, node.y, node.x - node.speedX * 10, node.y - node.speedY * 10);

          for (let j = i + 1; j < nodes.length; j++) {
            let distBetween = p.dist(node.x, node.y, nodes[j].x, nodes[j].y);
            if (distBetween < 100) {
              p.stroke(255, 150);
              p.line(node.x, node.y, nodes[j].x, nodes[j].y);
            }
          }
        }
      }

      function drawInclusivity() {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            let distBetween = p.dist(node.x, node.y, nodes[j].x, nodes[j].y);
            if (distBetween < 150) {
              p.stroke(255, p.map(distBetween, 0, 150, 150, 50));
              p.line(node.x, node.y, nodes[j].x, nodes[j].y);
            }
          }
        }
      }

      function drawInnovation() {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];

          node.x += p.sin(p.frameCount * 0.01 + i) * 3 * nodeSpeedFactor;
          node.y += p.cos(p.frameCount * 0.01 + i) * 3 * nodeSpeedFactor;

          p.push();
          p.translate(node.x, node.y);
          p.rotate(node.angle);
          p.rect(-node.size / 2, -node.size / 2, node.size, node.size);
          p.pop();

          for (let j = i + 1; j < nodes.length; j++) {
            let distBetween = p.dist(node.x, node.y, nodes[j].x, nodes[j].y);
            if (distBetween < 100) {
              p.stroke(255, 150);
              p.line(node.x, node.y, nodes[j].x, nodes[j].y);
            }
          }
        }
      }

      p.mouseWheel = (event) => {
        nodeSizeFactor += event.delta * 0.001;
        nodeSizeFactor = p.constrain(nodeSizeFactor, 0.5, 2);
      };
    };

    new p5(sketch);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.taglineContainer}>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{description}</p>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Get Started
          </Link>
        </div>

        <div ref={canvasRef}></div>

        <div className="sectionCaret">
          <svg x="0px" y="0px" viewBox="0 0 2000 30">
            <polygon className="polygon-fill" points="1000,30 0,30 0,0 980,0 "></polygon>
            <polygon className="polygon-fill" points="1000,30 2000,30 2000,0 1020,0 "></polygon>
          </svg>
        </div>
      </div>
    </header>
  );
}

export default WelcomeHero;
