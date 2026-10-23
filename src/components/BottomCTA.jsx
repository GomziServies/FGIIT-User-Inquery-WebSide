import React from 'react';

export default function BottomCTA({ onOpenDemo, onNavigate }) {
  return (
    <section id="cta" className="wrap section section--tight">
      <div className="surface">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '560px' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.18 }}>
              Turn your passion into a profession.
            </h2>
            <span style={{ fontSize: '15.5px', lineHeight: 1.6, color: 'var(--text2)' }}>
              Join the Job-Ready Batch for ₹2,999. Take the free assessment first, or sit in a live
              demo class before you decide.
            </span>
          </div>
          <div className="btn-row">
            <a className="btn btn-lime" href="#price" style={{ minHeight: '52px' }}>
              Enroll Now – ₹2,999
            </a>
            <a
              className="btn btn-ghost"
              href="/assessment"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('assessment');
                }
              }}
              style={{ minHeight: '52px' }}
            >
              Discover Your Trainer Level – Free Test
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenDemo}
              style={{ minHeight: '52px' }}
            >
              Join a Free Demo Class
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
