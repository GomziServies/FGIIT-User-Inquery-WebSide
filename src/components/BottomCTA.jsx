import React from 'react';

export default function BottomCTA({ onOpenDemo }) {
  return (
    <section className="wrap" style={{ paddingBottom: '52px' }}>
      <div
        style={{
          background: 'var(--tint)',
          border: '1px solid #D7E6B4',
          borderRadius: '24px',
          padding: 'clamp(26px, 5vw, 44px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.2 }}>
            Turn your passion into a profession.
          </h2>
          <span style={{ fontSize: '15px', color: 'var(--text2)' }}>
            Take the free Coach Level Test, then join our next Job-Ready Batch.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a className="btn btn-lime" href="#test">
            Take the test
          </a>
          <button type="button" className="btn btn-ghost" onClick={onOpenDemo}>
            Free demo class
          </button>
        </div>
      </div>
    </section>
  );
}
