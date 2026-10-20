import React, { useEffect, useRef, useState } from 'react';
import { CERT_IMGS } from '../data/fgiitData';
import useAutoScroll from '../hooks/useAutoScroll';
import Icon from './Icons';

export default function CertificateGallery() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useAutoScroll(trackRef, { interval: 3600 });

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.children[i];
    if (item) track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  const go = (dir) => {
    const next = (index + dir + CERT_IMGS.length) % CERT_IMGS.length;
    setIndex(next);
    scrollToIndex(next);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => {
      const children = [...track.children];
      let closest = 0;
      let best = Infinity;
      children.forEach((child, i) => {
        const d = Math.abs(child.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < best) {
          best = d;
          closest = i;
        }
      });
      setIndex(closest);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="cert-gallery">
      <div className="cert-gallery-head">
        <h3 className="cert-gallery-title">Sample Certificates – Preview</h3>
        <div className="cert-gallery-nav">
          <button
            type="button"
            className="cert-gallery-btn"
            onClick={() => go(-1)}
            aria-label="Previous certificate"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <span className="cert-gallery-count" aria-live="polite">
            {index + 1} / {CERT_IMGS.length}
          </span>
          <button
            type="button"
            className="cert-gallery-btn"
            onClick={() => go(1)}
            aria-label="Next certificate"
          >
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
      </div>

      <div
        className="cert-gallery-track"
        ref={trackRef}
        role="region"
        aria-label="Sample certificate previews"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
      >
        {CERT_IMGS.map((c) => (
          <figure key={c.file} className="cert-gallery-item">
            <img src={`/images/${c.file}`} alt={c.alt} loading="lazy" />
            <figcaption>
              <span className="cert-gallery-badge">Sample</span>
              {c.alt.replace('Sample ', '')}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
