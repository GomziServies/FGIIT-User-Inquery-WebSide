import React from 'react';
import Icon from './Icons';

export default function DemoCta({ onOpenDemo }) {
  return (
    <section id="demo" className="wrap section section--flush-bottom">
      <div className="surface-plain">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(20px, 4vw, 48px)',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <span className="eyebrow">Free demo class</span>
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2 }}>
              Experience Our Teaching Before You Enroll
            </h2>
            <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', maxWidth: '560px' }}>
              Watch a recorded class or sit in a live session with our faculty. Free, no commitment —
              pick a slot that suits you and the details arrive on WhatsApp.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-lime"
            onClick={onOpenDemo}
            style={{ minHeight: '54px', width: '100%', maxWidth: '320px' }}
          >
            <Icon name="live" size={18} />
            Join a Free Demo Class
          </button>
        </div>
      </div>
    </section>
  );
}
