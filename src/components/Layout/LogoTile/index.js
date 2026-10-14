import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

/**
 * Letters for the fallback: `letters` cut to `maxLetters` when not blank,
 * otherwise the first letter of `name`, or with `maxLetters` 2 the first
 * letters of its first two words. Always uppercase, "?" when empty.
 *
 * @param {string} [name] Name to take the letters from.
 * @param {string} [letters] Letters to show instead.
 * @param {number} [maxLetters=1] How many letters at most.
 * @returns {string}
 */
function logoLetters(name, letters, maxLetters = 1) {
  const custom = String(letters ?? "").trim();
  const text = custom
    ? custom.slice(0, maxLetters)
    : String(name ?? "")
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .slice(0, maxLetters)
        .join("");
  return text.toUpperCase() || "?";
}

/**
 * Square or round logo tile: an image, or the name's first letters when the
 * image is missing or fails to load. Decorative, the name always sits next to
 * it as text. Size, radius, colors and fit come from CSS variables that the
 * caller sets through `className` or `style`.
 *
 * @param {object} props
 * @param {string} [props.src] Image path, resolved with useBaseUrl. Without it the letters show.
 * @param {string} [props.srcDark] Image path for dark mode.
 * @param {string} [props.name] Name the fallback letters come from.
 * @param {string} [props.letters] Fallback letters to show instead of the ones from `name`.
 * @param {number} [props.maxLetters=1] 1 for the first letter, 2 for the first letters of the first two words.
 * @param {boolean} [props.lazy=true] Load the image lazily.
 * @param {string} [props.className] Class on the tile, the place to set the CSS variables.
 * @param {object} [props.style] Inline style on the tile, for example a variable from data.
 */
export default function LogoTile({ src, srcDark, name, letters, maxLetters = 1, lazy = true, className, style }) {
  const light = useBaseUrl(src || "/");
  const dark = useBaseUrl(srcDark || src || "/");
  const { colorMode } = useColorMode();
  // URLs that failed to load. The tile falls back only while the source that
  // the current color mode shows is in here, so a new `src` or a switch to a
  // working dark variant brings the image back.
  const [failed, setFailed] = useState(() => new Set());
  const active = colorMode === "dark" && srcDark ? dark : light;
  const showImage = Boolean(src) && !failed.has(active);

  const markFailed = (img) => {
    const url = img.getAttribute("src");
    setFailed((previous) => (previous.has(url) ? previous : new Set(previous).add(url)));
  };
  // An image rendered on the server can fail before React attaches onError.
  // A finished image without a pixel size failed that way. (Avoid decode()
  // here, it changes how Chrome scales the image.)
  const tileRef = useRef(null);
  useEffect(() => {
    tileRef.current?.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markFailed(img);
    });
  }, [light, dark, showImage]);
  const imageProps = {
    className: styles.image,
    loading: lazy ? "lazy" : undefined,
    onError: (event) => markFailed(event.currentTarget),
  };

  return (
    <span
      ref={tileRef}
      className={clsx(styles.tile, !showImage && styles.withFallback, className)}
      style={style}
      aria-hidden="true"
    >
      {!showImage ? (
        <span className={styles.letters}>{logoLetters(name, letters, maxLetters)}</span>
      ) : srcDark ? (
        <ThemedImage sources={{ light, dark }} alt="" {...imageProps} />
      ) : (
        <img src={light} alt="" {...imageProps} />
      )}
    </span>
  );
}
