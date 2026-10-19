import React from 'react';
import {
  CERT_STEPS,
  CERT_ONLY,
  CERT_IMGS,
} from '../data/fgiitData';

export default function CertificateOnly({ onApplyExam, onOpenEmi }) {
  return (
    <section id="certificate" className="wrap" style={{ paddingTop: '52px', paddingBottom: '8px' }}>
      <div
        style={{
          background: 'var(--tint)',
          border: '2px solid var(--lime)',
          borderRadius: '28px',
          padding: 'clamp(20px, 4vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div className="head">
          <span
            style={{
              alignSelf: 'flex-start',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.1em',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'var(--lime)',
            }}
          >
            ALREADY HAVE THE KNOWLEDGE?
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 38px)', lineHeight: 1.15 }}>
            Get your certificate in just 7 days.
          </h2>
          <p style={{ color: 'var(--text2)' }}>
            Skip the course. Give a 100-mark MCQ exam and a viva, and your FGIIT certificate is delivered to your home by post or courier.
          </p>
        </div>

        <div className="chips">
          <span className="pill">✓ Central Government approved</span>
          <span className="pill">✓ Internationally valid</span>
          <span className="pill">✓ Lifetime validity</span>
        </div>

        {/* 4 Steps */}
        <div
          className="grid"
          id="certSteps"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
          }}
        >
          {CERT_STEPS.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid var(--line)',
              }}
            >
              <span className="serif" style={{ fontSize: '20px', color: 'var(--deep)' }}>
                {step.num}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.35 }}>
                {step.title}
              </span>
              <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--muted)' }}>
                {step.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Certificate Only Cards */}
        <div
          className="grid"
          id="certOnly"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {CERT_ONLY.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '15px', lineHeight: 1.35 }}>
                {item.name}
              </span>
              <span className="serif" style={{ fontSize: '26px' }}>
                {item.price}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep)' }}>
                {item.kind === 'big' ? '2-part payment available' : 'One-time fee'}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  onApplyExam({
                    course: item.name,
                    price: item.price,
                    kind: item.kind,
                  })
                }
                style={{ marginTop: 'auto', minHeight: '44px' }}
              >
                Apply for exam
              </button>
            </div>
          ))}
        </div>

        {/* Nutri-Trainer All Certificates Banner */}
        <div
          style={{
            background: '#fff',
            border: '2px solid var(--lime)',
            borderRadius: '20px',
            padding: '20px 22px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 300px' }}>
            <span style={{ fontWeight: 700, fontSize: '17px' }}>
              Nutri-Trainer: all certificates
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
              Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting.
            </span>
            <span
              style={{
                alignSelf: 'flex-start',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: '999px',
                background: 'var(--tint2)',
                color: 'var(--deep)',
              }}
            >
              EMI available · Up to 12 EMIs · 0% interest · 0% down payment
            </span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="serif" style={{ fontSize: '32px' }}>
              ₹54,000
            </span>
            <button
              type="button"
              className="btn btn-lime"
              onClick={() =>
                onApplyExam({
                  course: 'Nutri-Trainer: all certificates',
                  price: '₹54,000',
                  kind: 'all',
                })
              }
            >
              Apply for exam
            </button>
            <button type="button" className="btn btn-ghost" onClick={onOpenEmi}>
              Check EMI options
            </button>
          </span>
        </div>

        {/* Sample Certificates Carousel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '17px' }}>Sample certificates</h3>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Swipe →</span>
        </div>
        <div
          className="carousel"
          id="certImgs"
          role="region"
          aria-label="Sample FGIIT certificates"
        >
          {CERT_IMGS.map((c, idx) => (
            <img
              key={idx}
              src={`/images/${c.file}`}
              alt={`Sample FGIIT ${c.alt} certificate`}
              loading="lazy"
              style={{
                width: '220px',
                height: '311px',
                objectFit: 'contain',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                display: 'block',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
