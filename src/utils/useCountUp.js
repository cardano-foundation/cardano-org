import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 1500;

// Animate a numeric value from 0 to target with an easeOutCubic curve.
// Returns the current animated value; skips the animation when target is null.
export default function useCountUp(target, duration = DEFAULT_DURATION) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (target == null) return undefined;

    const end = target;
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
