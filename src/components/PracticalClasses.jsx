import React from 'react';
import { GALLERY } from '../data/fgiitData';

export default function PracticalClasses() {
  return (
    <section
      className="wrap"
      style={{
        paddingTop: '28px',
        paddingBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '17px' }}>Inside our practical classes</h3>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Swipe →</span>
      </div>
      <div
        className="carousel"
        id="gallery"
        role="region"
        aria-label="Photos from FGIIT practical classes"
      >
        {GALLERY.map((item, idx) => (
          <figure
            key={idx}
            style={{
              margin: 0,
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <img
              src={`/images/${item.file}`}
              alt={item.caption}
              loading="lazy"
              style={{
                width: '260px',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '16px',
                display: 'block',
              }}
            />
            <figcaption style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
