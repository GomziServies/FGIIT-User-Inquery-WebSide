import React from 'react';

export default function Hero({ onOpenDemo }) {
  return (
    <section id="top" style={{ background: 'linear-gradient(180deg, #F4F9E6 0%, #fff 100%)' }}>
      <div
        className="wrap"
        style={{
          paddingTop: 'clamp(36px, 5vw, 68px)',
          paddingBottom: 'clamp(32px, 4vw, 56px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '1 1 480px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#fff',
              border: '1px solid #D7E6B4',
              color: 'var(--deep)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
            }}
          >
            Six-Month Diploma Online Courses
          </span>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Live Online Classes
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 5vw, 56px)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            Join Our Job-Ready Batch
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 'clamp(18px, 2.2vw, 23px)',
              lineHeight: 1.4,
              fontWeight: 700,
              color: 'var(--deep)',
              maxWidth: '540px',
            }}
          >
            100% Job Placement with Handsome Salary Packages
          </p>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--muted)',
              maxWidth: '540px',
            }}
          >
            Open to students who have passed Class 10th or Class 12th, and to working trainers who
            want to upskill. Learn training, nutrition, rehabilitation and the business of coaching
            on a structured syllabus, then move into real client work.
          </p>

          <div className="btn-row">
            <a className="btn btn-lime" href="#price" style={{ minHeight: '54px' }}>
              Enroll Now – ₹2,999
            </a>
            <button
              type="button"
              className="btn btn-green"
              onClick={onOpenDemo}
              style={{ minHeight: '54px' }}
            >
              Join a Free Demo Class
            </button>
            <a className="btn btn-ghost" href="#test" style={{ minHeight: '54px' }}>
              Discover Your Trainer Level – Free Test
            </a>
          </div>

          <div className="stat-row" style={{ paddingTop: '6px' }}>
            <div className="stat">
              <span className="stat-num">25,000+</span>
              <span className="stat-label">students trained</span>
            </div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">job placement</span>
            </div>
            <div className="stat">
              <span className="stat-num">Lifetime</span>
              <span className="stat-label">student support</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 0, position: 'relative' }}>
          <img
            src="/images/hybrid-portrait.jpg"
            alt="FGIIT faculty teaching an offline class while online students join live on screen"
            style={{
              width: '100%',
              maxHeight: '560px',
              aspectRatio: '4/5',
              objectFit: 'cover',
              borderRadius: '28px',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '16px',
              right: '16px',
              bottom: '16px',
              background: 'rgba(255, 255, 255, 0.96)',
              borderRadius: '18px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 10px 28px rgba(11, 18, 16, 0.14)',
            }}
          >
            <span
              className="serif"
              style={{
                fontSize: '26px',
                lineHeight: 1,
                color: 'var(--deep)',
                flex: 'none',
              }}
            >
              ₹2,999
            </span>
            <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text2)' }}>
              <b style={{ color: 'var(--ink)' }}>One eligible course.</b> Live classes, recorded
              lessons, e-books and the app.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
