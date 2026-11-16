import React, { useEffect, useRef, useState } from "react";
import { getEpochDate } from "@site/src/utils/insights/epochs";
import styles from "./styles.module.css";

/**
 * Box with a two-handle slider that selects a range of epochs. Keyboard users
 * move each handle with the arrow keys, mouse users click or drag on the track.
 * The selected range is controlled by the page, `useEpochRange` keeps it in a
 * cookie.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title Heading of the box.
 * @param {number} props.min Lowest selectable epoch.
 * @param {number} [props.max] Latest epoch. Without it only the title and the children show.
 * @param {number} [props.start] First selected epoch.
 * @param {number} [props.end] Last selected epoch.
 * @param {Function} props.onChange Called with `{ start, end }` when the selected epochs change. Pass the new range back as `start` and `end`.
 * @param {React.ReactNode} props.startLabel Label before the first epoch, for example "Start:".
 * @param {React.ReactNode} props.endLabel Label before the last epoch, for example "End:".
 * @param {React.ReactNode} props.epochLabel Word before the selected epoch numbers.
 * @param {React.ReactNode} [props.children] Status lines shown below the slider inside the box.
 */
export default function EpochRangeSlider({ title, min, max, start, end, onChange, startLabel, endLabel, epochLabel, children }) {
  const span = max ? max - min + 1 : 1;
  const percentFor = (epoch) => ((epoch - min) / span) * 100;
  const epochFor = (percent) => Math.round(min + (percent / 100) * span);

  // Handle positions in percent. Keyboard steps keep the raw value, so the
  // handle moves smoothly while the epoch is rounded.
  const [startPercent, setStartPercent] = useState(0);
  const [endPercent, setEndPercent] = useState(100);
  const reported = useRef(null);
  const trackRef = useRef(null);
  const stopDrag = useRef(null);

  // Follow a range set from outside (loaded from the cookie), but not the echo
  // of the slider's own changes.
  useEffect(() => {
    if (!max || start == null || end == null) return;
    const last = reported.current;
    if (last && last.start === start && last.end === end) return;
    setStartPercent(percentFor(start));
    setEndPercent(percentFor(end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, min, max]);

  useEffect(() => () => stopDrag.current?.(), []);

  // Only a change of the selected epochs is reported, a small handle step
  // within the same epoch only moves the handle.
  const report = (next) => {
    if (next.start === start && next.end === end) return;
    reported.current = next;
    onChange(next);
  };

  // The epoch is clamped first. Keyboard steps keep their raw position, mouse
  // positions snap to the epoch, and a handle never comes closer than half a
  // percent to the other one.
  const moveStart = (percent, snap) => {
    const epoch = Math.max(min, Math.min(epochFor(percent), end - 1));
    const position = snap ? percentFor(epoch) : percent;
    if (position >= endPercent - 0.5) return;
    setStartPercent(position);
    report({ start: epoch, end });
  };

  const moveEnd = (percent, snap) => {
    const epoch = Math.min(max, Math.max(epochFor(percent), start + 1));
    const position = snap ? percentFor(epoch) : percent;
    if (position <= startPercent + 0.5) return;
    setEndPercent(position);
    report({ start, end: epoch });
  };

  // A click on the track jumps the nearer handle there, then the mouse drags it.
  const startMouseDrag = (event, move) => {
    const percentAt = (clientX) => {
      const rect = trackRef.current.getBoundingClientRect();
      return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    };
    move(percentAt(event.clientX), true);
    const onMove = (moveEvent) => move(percentAt(moveEvent.clientX), true);
    const onUp = () => stopDrag.current?.();
    stopDrag.current = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      stopDrag.current = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const middle = (startPercent + endPercent) / 2;

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>{title}</h3>
      {max && start != null && end != null && (
        <div className={styles.slider}>
          <div className={styles.values}>
            <div>
              <span className={styles.valueLabel}>{startLabel}{" "}</span>
              <strong className={styles.value}>{epochLabel}{" "}{start}</strong>
              <span className={styles.date}>({getEpochDate(start)})</span>
            </div>
            <div>
              <span className={styles.valueLabel}>{endLabel}{" "}</span>
              <strong className={styles.value}>{epochLabel}{" "}{end}</strong>
              <span className={styles.date}>({getEpochDate(end)})</span>
            </div>
          </div>
          <div ref={trackRef} className={styles.trackArea}>
            <div className={styles.track} />
            <div className={styles.range} style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={startPercent}
              onChange={(e) => moveStart(parseFloat(e.target.value), false)}
              className={styles.handle}
              style={{ zIndex: 2 }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={endPercent}
              onChange={(e) => moveEnd(parseFloat(e.target.value), false)}
              className={styles.handle}
              style={{ zIndex: 3 }}
            />
            {/* Mouse-only click and drag areas. Keyboard users move the handles
                through the range inputs above. */}
            <div
              aria-hidden="true"
              className={styles.dragZone}
              style={{ left: 0, width: `${Math.min(middle + 10, 100)}%` }}
              onMouseDown={(e) => startMouseDrag(e, moveStart)}
            />
            <div
              aria-hidden="true"
              className={styles.dragZone}
              style={{ left: `${Math.max(middle - 10, 0)}%`, width: `${100 - Math.max(middle - 10, 0)}%` }}
              onMouseDown={(e) => startMouseDrag(e, moveEnd)}
            />
          </div>
          <div className={styles.scale}>
            <span>Epoch {min}</span>
            <span>Epoch {max}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export { default as useEpochRange } from "./useEpochRange";
