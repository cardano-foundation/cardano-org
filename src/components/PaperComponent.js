import React, { useRef, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const walletData = [
{ holdings: 15015000000, wallets: 38, name: 'I' },
{ holdings: 5630000000, wallets: 243, name: 'H' },
{ holdings: 5600000000, wallets: 2192, name: 'G' },
{ holdings: 3490000000, wallets: 12559, name: 'F' },
{ holdings: 1270000000, wallets: 39419, name: 'E' },
{ holdings: 206930000, wallets: 54507, name: 'D' },
{ holdings: 21100000, wallets: 55921, name: 'C' },
{ holdings: 2810000, wallets: 81566, name: 'B' }
];

const TOTAL_SUPPLY = 36160000000;
const HANDLE_LEN_RATE = 2.4;

/**
 * @typedef {Object} WalletData
 * @property {number} holdings
 * @property {number} wallets 
 * @property {string} name
 */

/**
 * @typedef {Object} CirclePair
 * @property {paper.Group} group
 * @property {paper.Path.Circle} solidCircle
 * @property {paper.Path.Circle} transparentCircle
 * @property {number} transparentRadius
 * @property {{solid: paper.Color, transparent: paper.Color}} originalColors
 */

function PaperImplementation() {
 const canvasRef = useRef(null);
 const initialized = useRef(false);
 const allCirclePairs = useRef([]);
 const connectionLayer = useRef();
 const circleLayer = useRef();

 const random = (min, max) => {
   return Math.random() * (max - min) + min;
 };

 const getRadius = (holdings) => {
   const minRadius = 2.5;
   const maxRadius = 550;
   const percentage = holdings / TOTAL_SUPPLY;
   return minRadius + (percentage * (maxRadius - minRadius));
 };

 const getVector = (radians, length) => {
   return new window.paper.Point({
     angle: radians * 180 / Math.PI,
     length: length
   });
 };

 const createCirclePair = (center, holdings, category) => {
   const solidRadius = getRadius(holdings);
   
   let transparentRadius;
   if (['B', 'C', 'D', 'E', 'F'].includes(category)) {
     transparentRadius = random(solidRadius * 1.2, solidRadius * 6);
   } else {
     transparentRadius = random(solidRadius * 1.2, solidRadius * 2);
   }
   
   const transparentCircle = new window.paper.Path.Circle({
     center: center,
     radius: transparentRadius,
     fillColor: new window.paper.Color(1, 1, 1, 0.2)
   });
   
   const solidCircle = new window.paper.Path.Circle({
     center: center,
     radius: solidRadius,
     fillColor: new window.paper.Color('white'),
     strokeColor: new window.paper.Color('white'),
     strokeWidth: 1
   });
   
   const group = new window.paper.Group([transparentCircle, solidCircle]);
   
   group.onMouseDrag = (event) => {
     group.translate(event.delta);
   };
   
   const circlePair = {
     group,
     solidCircle,
     transparentCircle,
     transparentRadius,
     originalColors: {
       solid: solidCircle.fillColor.clone(),
       transparent: transparentCircle.fillColor.clone()
     }
   };
   
   allCirclePairs.current.push(circlePair);
   return group;
 };

 const createBlobPath = (
   ball1,
   ball2,
   v,
   handle_len_rate,
   maxDistance
 ) => {
   const center1 = ball1.position;
   const center2 = ball2.position;
   const radius1 = ball1.bounds.width / 2;
   const radius2 = ball2.bounds.width / 2;
   const pi2 = Math.PI / 2;
   const d = center1.getDistance(center2);
   let u1, u2;

   if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
     return undefined;
   }

   if (d < radius1 + radius2) {
     u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
       (2 * radius1 * d));
     u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
       (2 * radius2 * d));
   } else {
     u1 = 0;
     u2 = 0;
   }

   const angle1 = center2.subtract(center1).angleInRadians;
   const angle2 = Math.acos((radius1 - radius2) / d);
   const angle1a = angle1 + u1 + (angle2 - u1) * v;
   const angle1b = angle1 - u1 - (angle2 - u1) * v;
   const angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
   const angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;

   const p1a = center1.add(getVector(angle1a, radius1));
   const p1b = center1.add(getVector(angle1b, radius1));
   const p2a = center2.add(getVector(angle2a, radius2));
   const p2b = center2.add(getVector(angle2b, radius2));

   const totalRadius = (radius1 + radius2);
   let d2 = Math.min(v * handle_len_rate, p1a.subtract(p2a).length / totalRadius);
   d2 *= Math.min(1, d * 2 / (radius1 + radius2));

   const r1 = radius1 * d2;
   const r2 = radius2 * d2;

   const path = new window.paper.Path({
     segments: [p1a, p2a, p2b, p1b],
     fillColor: new window.paper.Color('white'),
     closed: true
   });

   const segments = path.segments;
   segments[0].handleOut = getVector(angle1a - pi2, r1);
   segments[1].handleIn = getVector(angle2a + pi2, r2);
   segments[2].handleOut = getVector(angle2b - pi2, r2);
   segments[3].handleIn = getVector(angle1b + pi2, r1);

   return path;
 };

 const generateConnections = () => {
   if (!connectionLayer.current) return;
   connectionLayer.current.removeChildren();

   for (let i = 0; i < allCirclePairs.current.length; i++) {
     for (let j = i + 1; j < allCirclePairs.current.length; j++) {
       const pair1 = allCirclePairs.current[i];
       const pair2 = allCirclePairs.current[j];
       
       const distance = pair1.solidCircle.position.getDistance(pair2.solidCircle.position);
       const maxDistance = 25 + (pair1.solidCircle.bounds.width + pair2.solidCircle.bounds.width) / 2;
       
       if (distance < maxDistance) {
         const connection = createBlobPath(
           pair1.solidCircle,
           pair2.solidCircle,
           0.5,
           HANDLE_LEN_RATE,
           maxDistance
         );
         if (connection) {
           connectionLayer.current.addChild(connection);
         }
       }
     }
   }
 };

 const setupCanvas = () => {
   if (!canvasRef.current || !window.paper || initialized.current) return;
   
   window.paper.setup(canvasRef.current);
   connectionLayer.current = new window.paper.Layer();
   circleLayer.current = new window.paper.Layer();

   walletData.forEach((category) => {
     const scaleFactor = 825;
     const numCircles = Math.max(1, Math.ceil(category.wallets / scaleFactor));
     
     for (let i = 0; i < numCircles; i++) {
       const margin = 100;
       const x = random(margin, window.paper.view.size.width - margin);
       const y = random(margin, window.paper.view.size.height - margin);
       createCirclePair(new window.paper.Point(x, y), category.holdings, category.name);
     }
   });

   window.paper.view.onFrame = () => {
     allCirclePairs.current.forEach(pair1 => {
       pair1.solidCircle.fillColor = pair1.originalColors.solid;
       pair1.transparentCircle.fillColor = pair1.originalColors.transparent;

       allCirclePairs.current.forEach(pair2 => {
         if (pair1 !== pair2) {
           const distance = pair1.solidCircle.position.getDistance(pair2.solidCircle.position);
           const minDistance = (pair1.solidCircle.bounds.width + pair2.solidCircle.bounds.width) / 2;

           if (distance < minDistance) {
             pair1.solidCircle.fillColor = new window.paper.Color(1, 0.8, 0.8, 1);
             pair2.solidCircle.fillColor = new window.paper.Color(1, 0.8, 0.8, 1);
             pair1.transparentCircle.fillColor = new window.paper.Color(1, 0.8, 0.8, 0.3);
             pair2.transparentCircle.fillColor = new window.paper.Color(1, 0.8, 0.8, 0.3);
           }
         }
       });
     });

     generateConnections();
   };

   initialized.current = true;
 };

 useEffect(() => {
   const script = document.createElement('script');
   script.src = 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js';
   script.onload = setupCanvas;
   document.head.appendChild(script);
   return () => {
     script.remove();
     if (window.paper && window.paper.view) {
       window.paper.view.remove();
     }
   };
 }, []);

 return (
<canvas 
  ref={canvasRef}
  style={{
    backgroundColor: '#0538AF',
    border: '1px solid #0538AF',
    cursor: 'pointer'
  }}
  width={window.innerWidth} 
  height={window.innerHeight}
/>
 );
}

export default function PaperComponent() {
 return (
   <BrowserOnly>
     {() => <PaperImplementation />}
   </BrowserOnly>
 );
}