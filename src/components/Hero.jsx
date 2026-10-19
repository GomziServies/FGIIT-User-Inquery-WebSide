import React from 'react';

export default function Hero({ onOpenDemo }) {
  return (
    <section id="top" style={{ background: 'linear-gradient(180deg, #F4F9E6 0%, #fff 100%)' }}>
      <div
        className="wrap"
        style={{
          paddingTop: '44px',
          paddingBottom: '44px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '36px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <span
            style={{
              alignSelf: 'flex-start',
              padding: '7px 14px',
              borderRadius: '999px',
              background: '#fff',
              border: '1px solid #D7E6B4',
              color: 'var(--deep)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.06em',
            }}
          >
            JOB-READY BATCH · 6-MONTH DIPLOMA · ONLINE &amp; OFFLINE
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(32px, 4.4vw, 46px)', lineHeight: 1.12 }}>
            Join our Job-Ready Batch.
          </h1>
          <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.65, color: 'var(--muted)', maxWidth: '520px' }}>
            Learn training, nutrition, rehab and the business of coaching A to Z in 6 months. After the course, get{' '}
            <b style={{ color: 'var(--ink)' }}>100% job placement with a handsome salary package</b>, in India or abroad.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-lime" href="#test" style={{ minHeight: '52px' }}>
              Take the free Coach Level Test
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenDemo}
              style={{ minHeight: '52px' }}
            >
              Join free demo class
            </button>
          </div>
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              paddingTop: '8px',
              maxWidth: '520px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="serif" style={{ fontSize: '26px', color: 'var(--deep)' }}>
                25,000+
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>students trained</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="serif" style={{ fontSize: '26px', color: 'var(--deep)' }}>
                100%
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>job placement</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="serif" style={{ fontSize: '26px', color: 'var(--deep)' }}>
                Lifetime
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>student support</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 0, position: 'relative' }}>
          <img
            src="/images/hybrid-portrait.jpg"
            alt="FGIIT faculty teaching an offline class while online students join live on screen"
            style={{
              width: '100%',
              maxHeight: '520px',
              aspectRatio: '4/5',
              objectFit: 'cover',
              borderRadius: '24px',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '16px',
              bottom: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(11, 18, 16, 0.12)',
            }}
          >
            <span
              style={{
                width: '36px',
                height: '36px',
                flex: 'none',
                borderRadius: '50%',
                background: 'var(--lime)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B1210"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text2)' }}>
              <b style={{ color: 'var(--ink)' }}>Online + offline, live together.</b> Online students feel like they’re in
              class and ask questions one-on-one.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
