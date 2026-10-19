import React from 'react';
import { COACHES } from '../data/fgiitData';

export default function Coaches() {
  return (
    <section
      className="wrap"
      style={{
        paddingTop: '52px',
        paddingBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div className="head">
          <span className="eyebrow">OUR CERTIFIED COACHES</span>
          <h2>Real students. Real certificates.</h2>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Swipe →</span>
      </div>

      <div
        className="carousel"
        id="coaches"
        role="region"
        aria-label="FGIIT certified students"
      >
        {COACHES.map((coach, idx) => (
          <figure
            key={idx}
            style={{
              margin: 0,
              width: '210px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <img
              src={`/images/${coach.file}`}
              alt={`${coach.name}, ${coach.course}`}
              loading="lazy"
              style={{
                width: '210px',
                height: '270px',
                objectFit: 'cover',
                borderRadius: '16px',
                display: 'block',
              }}
            />
            <figcaption style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{coach.name}</span>
              <span style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--muted)' }}>
                {coach.course}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
