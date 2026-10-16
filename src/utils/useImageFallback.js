import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks which image URLs failed to load, so a component can show a fallback
 * instead of a broken image. Put `ref` on the image or on an element around
 * the images, and `onError` on each image.
 *
 * An image rendered on the server can fail before React attaches `onError`.
 * After every render the hook therefore also marks images inside `ref` that
 * finished loading without a pixel size. (It avoids `decode()`, which changes
 * how Chrome scales the image.) An SVG needs a size of its own, through
 * width and height or a sized viewBox, or it counts as failed too.
 *
 * @returns {{ ref: object, onError: Function, hasFailed: (url: string) => boolean }}
 *   `hasFailed` takes the URL as it appears in the image's `src` attribute.
 */
export default function useImageFallback() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(() => new Set());

  const markFailed = useCallback((img) => {
    const url = img.getAttribute("src");
    setFailed((previous) => (previous.has(url) ? previous : new Set(previous).add(url)));
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const images = root.tagName === "IMG" ? [root] : root.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markFailed(img);
    });
  });

  return {
    ref,
    onError: (event) => markFailed(event.currentTarget),
    hasFailed: (url) => failed.has(url),
  };
}
