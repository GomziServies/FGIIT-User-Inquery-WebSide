import React from 'react';

export default function Hero({ onOpenDemo, onNavigate }) {
  return (
    <section id="top" style={{ background: 'linear-gradient(180deg, #F4F9E6 0%, #FFFFFF 100%)' }}>
      <div
        className="wrap"
        style={{
          paddingTop: 'clamp(40px, 5.5vw, 76px)',
          paddingBottom: 'clamp(36px, 4.5vw, 64px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(36px, 5vw, 68px)',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '1 1 500px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'flex-start',
          }}
        >
          {/* Eyebrow Status Badge */}
          <a
            href="#price"
            className="hero-badge-pill"
            aria-label="Batch 2026 Admitting Now - 100% Placement Support Guarantee"
          >
            <span className="pulse-dot" aria-hidden="true" />
            <span>BATCH 2026 ADMITTING NOW · 100% PLACEMENT SUPPORT GUARANTEE</span>
            <span className="hero-badge-arrow" aria-hidden="true">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </a>

          {/* High-Impact Display Headline */}
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
            }}
          >
            Launch Your Fitness Career with Our{' '}
            <span style={{ color: 'var(--deep)', whiteSpace: 'nowrap' }}>
              Job&#8209;Ready Batch
            </span>
          </h1>

          {/* Balanced Subtitle */}
          <p
            className="hero-subtitle hide-sm"
            style={{
              margin: 0,
              fontSize: 'clamp(17px, 1.8vw, 19px)',
              lineHeight: 1.5,
              fontWeight: 500,
              color: 'var(--text2)',
              maxWidth: '560px',
            }}
          >
            Six-Month Diploma Online Courses with live interactive training, sports nutrition,
            rehabilitation, and guaranteed placement with leading fitness chains across India.
          </p>

          {/* Clear Primary & Secondary CTAs */}
          <div className="btn-row" style={{ alignItems: 'center', gap: '14px', paddingTop: '4px' }}>
            <a
              className="btn btn-lime"
              href="#price"
              style={{ minHeight: '54px', padding: '0 28px', fontSize: '15.5px' }}
            >
              Enroll Now · ₹2,999
              <span aria-hidden="true" style={{ fontSize: '17px', marginLeft: '4px' }}>
                →
              </span>
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenDemo}
              style={{ minHeight: '54px' }}
            >
              ▶ Watch Free Demo Class
            </button>
          </div>

          <a
            href="/assessment"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('assessment');
              }
            }}
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--deep)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span>Discover Your Trainer Level in 4 mins (Free Assessment)</span>
            <span aria-hidden="true">→</span>
          </a>

          {/* Authentic Social Proof Stack */}
          <div className="hero-social-proof">
            <div className="avatar-stack">
              <img src="/images/akash.jpg" alt="FGIIT Graduate Akash" />
              <img src="/images/harini.jpg" alt="FGIIT Graduate Harini" />
              <img src="/images/maliha.jpg" alt="FGIIT Graduate Maliha" />
              <img src="/images/zain.jpg" alt="FGIIT Graduate Zain" />
            </div>
            <div className="social-proof-text">
              <div className="stars-row">★★★★★</div>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                <b style={{ color: 'var(--ink)' }}>4.9/5 Rating</b> · 25,000+ Alumni Placed
              </span>
            </div>
          </div>
        </div>

        {/* Visual Anchor Column with Floating Glass Badges */}
        <div style={{ flex: '1 1 380px', minWidth: 0, position: 'relative' }}>
          <img
            src="/images/hybrid-wide.jpg"
            alt="FGIIT classroom batch learning live with faculty and online Zoom attendees"
            style={{
              width: '100%',
              maxHeight: '580px',
              aspectRatio: '4/5',
              objectFit: 'cover',
              objectPosition: 'center 32%',
              borderRadius: '28px',
              display: 'block',
              boxShadow: '0 24px 60px -16px rgba(11, 18, 16, 0.16)',
            }}
          />

          {/* Top Floating Glass Badge */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 12px 28px rgba(11, 18, 16, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>🏆</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                100% Placement
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                Top Gyms &amp; Clinics
              </div>
            </div>
          </div>

          {/* Bottom All-Inclusive Pass Floating Card */}
          <div
            style={{
              position: 'absolute',
              left: '16px',
              right: '16px',
              bottom: '16px',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 16px 36px rgba(11, 18, 16, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'var(--deep)',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.02em',
                }}
              >
                ₹2,999
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginTop: '3px',
                }}
              >
                All-Inclusive Pass
              </span>
            </div>
            <div
              style={{
                width: '1px',
                height: '38px',
                background: 'var(--line)',
                flex: 'none',
              }}
            />
            <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text2)' }}>
              <b style={{ color: 'var(--ink)' }}>One eligible course.</b> Live classes, recorded
              revision, e-books &amp; Academy app access.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

