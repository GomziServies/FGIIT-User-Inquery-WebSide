import React from 'react';
import { JOURNEY } from '../data/fgiitData';

export default function Journey() {
  return (
    <section className="wrap sec">
      <div className="head">
        <span className="eyebrow">YOUR JOURNEY</span>
        <h2>Admission to placement, in six steps.</h2>
      </div>

      <div
        id="journey"
        style={{
          background: 'var(--tint)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 32px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '18px',
        }}
      >
        {JOURNEY.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              className="serif"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                border: '2px solid var(--lime)',
                color: 'var(--deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              {step.num}
            </span>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>{step.title}</span>
            <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--muted)' }}>
              {step.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
