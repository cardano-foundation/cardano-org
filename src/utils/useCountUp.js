import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 1500;

// Animate a numeric value from 0 to target with an easeOutCubic curve.
// Returns the current animated value; safe when target is null (treats as 0).
export default function useCountUp(target, duration = DEFAULT_DURATION) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const end = target ?? 0;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}
