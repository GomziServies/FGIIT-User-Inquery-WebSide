import React from 'react';

export default function FreeDemoBanner({ onOpenDemo }) {
  return (
    <section id="demo" className="wrap" style={{ paddingTop: '36px', paddingBottom: '8px' }}>
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 32px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '18px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 340px' }}>
          <span className="eyebrow">FREE DEMO CLASS</span>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.2 }}>
            Try a class before you join.
          </h2>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Watch a recorded class, or sit in a live class with our faculty. Free, no commitment.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-lime"
          onClick={onOpenDemo}
          style={{ minHeight: '52px' }}
        >
          Join free demo class
        </button>
      </div>
    </section>
  );
}
