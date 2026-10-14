import React, { forwardRef, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const MedusaCanvas = lazy(() => import('./MedusaCanvas.js'));

// Client only entry point. three.js, d3-force and the history data are loaded
// on demand, the server renders nothing for this component.
const Medusa = forwardRef(function Medusa(props, ref) {
  return (
    <BrowserOnly fallback={null}>
      {() => (
        <Suspense fallback={null}>
          <MedusaCanvas ref={ref} {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
});

export default Medusa;
