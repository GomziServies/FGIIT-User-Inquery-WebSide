import React from 'react';
import { COURSES, NT_COMBO, inquiryLink, sendTelemetry } from '../data/fgiitData';

export default function Courses() {
  const included = NT_COMBO.courseIds.map((k) => COURSES[k].name);

  return (
    <section id="courses" className="wrap section" style={{ scrollMarginTop: '80px' }}>
      <div className="head" style={{ gap: '14px' }}>
        <span className="eyebrow">Our course</span>
        <h2>One Course. Your Complete Fitness Career.</h2>
        <p style={{ maxWidth: '640px' }}>
          The Nutri-Trainer Combo is taught live online with recorded lesson revision, digital study
          materials, and 100% placement support after completion.
        </p>
      </div>

      <article
        style={{
          background: '#FFFFFF',
          border: '2px solid #D6E8B0',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(155, 192, 40, 0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--tint)',
            padding: 'clamp(22px, 3vw, 30px) clamp(20px, 3.5vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span className="eyebrow">NUTRI-TRAINER COMBO · ALL COURSES IN ONE</span>
          <h3 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.2 }}>
            {NT_COMBO.name}
          </h3>
          <span style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--text2)' }}>
            {NT_COMBO.intro}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3.5vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div className="chips">
            {NT_COMBO.facts.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'var(--bg2)',
                  color: 'var(--text2)',
                }}
              >
                {f}
              </span>
            ))}
          </div>

          <b style={{ fontSize: '15px' }}>Courses included</b>
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '6px 20px',
            }}
          >
            {included.map((item) => (
              <div key={item} className="tick">
                <span style={{ color: 'var(--lime)', fontWeight: 800 }}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              paddingTop: '16px',
              borderTop: '1px solid #EEF2F0',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Full course · without certificate
            </span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                className="btn btn-lime"
                href={inquiryLink(NT_COMBO.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendTelemetry('inquiry_click', { course: NT_COMBO.name })}
                style={{ minHeight: '52px' }}
              >
                Inquiry Now
              </a>
              <a className="btn btn-ghost" href="#inpta" style={{ minHeight: '52px' }}>
                Need accreditation only?
              </a>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
