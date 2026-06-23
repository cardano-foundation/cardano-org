import React, { useRef, useState } from 'react';
import { getEpochDate } from '@site/src/utils/insights/epochs';
import { translate } from '@docusaurus/Translate';
import './index.css';

function epochToPercent(epoch, minEpoch, maxEpoch) {
  if (maxEpoch <= minEpoch) return 0;
  return ((epoch - minEpoch) / (maxEpoch - minEpoch)) * 100;
}

function percentToEpoch(percent, minEpoch, maxEpoch) {
  if (maxEpoch <= minEpoch) return minEpoch;
  return Math.round(minEpoch + (percent / 100) * (maxEpoch - minEpoch));
}

/** Padding (percent of track) so each range input includes its thumb hit area. */
const THUMB_HIT_PAD = 10;

/**
 * Dual-handle epoch range slider with pointer/touch support.
 * Each range input is clip-pathed to its half of the track so overlapping
 * inputs do not steal clicks from the other handle.
 */
export default function EpochRangeSlider({
  minEpoch,
  maxEpoch,
  startEpoch,
  endEpoch,
  onChange,
}) {
  const [activeHandle, setActiveHandle] = useState(null);

  const sliderStart = epochToPercent(startEpoch, minEpoch, maxEpoch);
  const sliderEnd = epochToPercent(endEpoch, minEpoch, maxEpoch);

  let startClipRight = Math.min(100, sliderEnd + THUMB_HIT_PAD);
  let endClipLeft = Math.max(0, sliderStart - THUMB_HIT_PAD);
  if (startClipRight > endClipLeft) {
    const mid = (sliderStart + sliderEnd) / 2;
    startClipRight = mid;
    endClipLeft = mid;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {translate({ id: 'epochRangeSlider.start', message: 'Start:' })}{' '}
          </span>
          <strong style={{ fontSize: '1.1rem' }}>
            {translate({ id: 'epochRangeSlider.epoch', message: 'Epoch' })}{' '}{startEpoch}
          </strong>
          <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
            ({getEpochDate(startEpoch)})
          </span>
        </div>
        <div>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {translate({ id: 'epochRangeSlider.end', message: 'End:' })}{' '}
          </span>
          <strong style={{ fontSize: '1.1rem' }}>
            {translate({ id: 'epochRangeSlider.epoch', message: 'Epoch' })}{' '}{endEpoch}
          </strong>
          <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
            ({getEpochDate(endEpoch)})
          </span>
        </div>
      </div>

      <div className="epoch-range-slider">
        <div className="epoch-range-slider__track" />
        <div
          className="epoch-range-slider__active"
          style={{ left: `${sliderStart}%`, width: `${sliderEnd - sliderStart}%` }}
        />

        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={sliderStart}
          aria-label={translate({ id: 'epochRangeSlider.startAria', message: 'Start epoch' })}
          className={`epoch-range-slider__input epoch-range-slider__input--start${activeHandle === 'start' ? ' epoch-range-slider__input--active' : ''}`}
          style={{
            zIndex: activeHandle === 'start' ? 5 : 3,
            clipPath: `polygon(0% 0%, ${startClipRight}% 0%, ${startClipRight}% 100%, 0% 100%)`,
          }}
          onPointerDown={() => setActiveHandle('start')}
          onPointerUp={() => setActiveHandle(null)}
          onPointerCancel={() => setActiveHandle(null)}
          onChange={(e) => {
            const newStart = parseFloat(e.target.value);
            if (newStart < sliderEnd - 0.5) {
              const newEpoch = percentToEpoch(newStart, minEpoch, maxEpoch);
              onChange(Math.max(minEpoch, Math.min(newEpoch, endEpoch - 1)), endEpoch);
            }
          }}
        />

        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={sliderEnd}
          aria-label={translate({ id: 'epochRangeSlider.endAria', message: 'End epoch' })}
          className={`epoch-range-slider__input epoch-range-slider__input--end${activeHandle === 'end' ? ' epoch-range-slider__input--active' : ''}`}
          style={{
            zIndex: activeHandle === 'end' ? 5 : 4,
            clipPath: `polygon(${endClipLeft}% 0%, 100% 0%, 100% 100%, ${endClipLeft}% 100%)`,
          }}
          onPointerDown={() => setActiveHandle('end')}
          onPointerUp={() => setActiveHandle(null)}
          onPointerCancel={() => setActiveHandle(null)}
          onChange={(e) => {
            const newEnd = parseFloat(e.target.value);
            if (newEnd > sliderStart + 0.5) {
              const newEpoch = percentToEpoch(newEnd, minEpoch, maxEpoch);
              onChange(startEpoch, Math.min(maxEpoch, Math.max(newEpoch, startEpoch + 1)));
            }
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
        <span>{translate({ id: 'epochRangeSlider.epoch', message: 'Epoch' })}{' '}{minEpoch}</span>
        <span>{translate({ id: 'epochRangeSlider.epoch', message: 'Epoch' })}{' '}{maxEpoch}</span>
      </div>
    </div>
  );
}
