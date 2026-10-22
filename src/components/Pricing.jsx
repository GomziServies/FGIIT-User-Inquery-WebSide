import React from 'react';
import { INCLUDES, ACCREDITATION_NOTE, CONFIG } from '../data/fgiitData';
import Icon from './Icons';

export default function Pricing({ onOpenDemo }) {
  return (
    <section id="price" className="wrap section section--flush-bottom">
      <div className="head">
        <span className="eyebrow">Course fee</span>
        <h2>Everything You Need to Start Your Fitness Career – Just ₹2,999</h2>
        <p className="lead">
          One fee opens the whole learning experience for the course you choose: live classes with
          expert faculty, recorded lessons, digital study material and the app that keeps it all in
          one place.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(24px, 4vw, 44px)',
          alignItems: 'stretch',
        }}
      >
        {/* Featured All-Inclusive Pass Card */}
        <div className="price-block" style={{ flex: '1 1 340px', minWidth: 0 }}>
          <div
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FCF2 100%)',
              border: '2px solid var(--lime)',
              borderRadius: 'var(--r-xl)',
              padding: 'clamp(24px, 3.5vw, 36px)',
              boxShadow: '0 16px 40px -10px rgba(155, 192, 40, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between',
              gap: '20px',
              position: 'relative',
            }}
          >
            {/* Top Popular Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  background: 'var(--lime)',
                  color: 'var(--ink)',
                }}
              >
                ★ All-Inclusive Access
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--deep)',
                  background: 'var(--tint2)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                Save 80%
              </span>
            </div>

            {/* Price display with strikethrough comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span className="price-tag">₹2,999</span>
                <span
                  style={{
                    fontSize: '18px',
                    color: 'var(--muted)',
                    textDecoration: 'line-through',
                    fontWeight: 600,
                  }}
                >
                  ₹14,999
                </span>
              </div>
              <span className="price-note">
                One-time complete fee · No hidden charges · Any 1 course
              </span>
            </div>

            {/* Value Deliverables Checklist */}
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: '12px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: '1px solid #E1ECE5',
                borderBottom: '1px solid #E1ECE5',
              }}
            >
              {[
                'Full 6-Month Diploma Online Course',
                'Daily Live Interactive Video Classes',
                'FGIIT Academy App (Lifetime Revision)',
                'Digital E-Books & Study Material PDF',
                '100% Job Placement Assistance After Certification',
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13.5px',
                    color: 'var(--text2)',
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--lime)',
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      flex: 'none',
                    }}
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="btn-row" style={{ marginTop: 'auto', gap: '10px' }}>
              <a
                className="btn btn-lime"
                href="#courses"
                style={{ minHeight: '52px', flex: '1 1 180px' }}
              >
                Enroll Now – ₹2,999
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onOpenDemo}
                style={{ minHeight: '52px' }}
              >
                Free Demo
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Learning Bento Grid */}
        <div
          style={{
            flex: '1 1 500px',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
          }}
        >
          {INCLUDES.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 10px rgba(11, 18, 16, 0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'var(--tint)',
                  color: 'var(--deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <h3 style={{ margin: 0, fontSize: '16.5px', lineHeight: 1.35 }}>{item.title}</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--muted)',
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditation is a separate route from the course fee */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          background: 'var(--bg2)',
          borderLeft: '4px solid var(--lime)',
          borderRadius: 'var(--r-md)',
          padding: '20px 22px',
        }}
      >
        <span style={{ color: 'var(--deep)', flex: 'none', marginTop: '1px' }}>
          <Icon name="certificate" size={20} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <b style={{ fontSize: '15px', color: 'var(--ink)' }}>Accreditation &amp; certification are separate</b>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
            {ACCREDITATION_NOTE}
          </p>
          <a
            href={CONFIG.INPTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-link"
            style={{ fontSize: '14px', fontWeight: 700 }}
          >
            See how to apply through INPTA →
          </a>
        </div>
      </div>
    </section>
  );
}
