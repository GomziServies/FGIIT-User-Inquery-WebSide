import React from 'react';
import { MONTHS } from '../data/fgiitData';

export default function Curriculum() {
  return (
    <section id="curriculum" className="wrap sec">
      <div className="head">
        <span className="eyebrow">JOB-READY BATCH · 6-MONTH CURRICULUM</span>
        <h2>From your first muscle to your first client.</h2>
      </div>

      <div
        className="curriculum-cards-grid"
        id="months"
      >
        {MONTHS.map((m, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--lime)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(11, 18, 16, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="serif"
                style={{
                  fontSize: '15px',
                  background: 'var(--tint2)',
                  color: 'var(--deep)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                }}
              >
                {m.num}
              </span>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{m.title}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {m.items.map((item, itemIdx) => (
                <div key={itemIdx} className="tick">
                  <span style={{ color: 'var(--lime)', fontWeight: 800 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
