import React from 'react';
import {
  INCLUDES,
  ACCREDITATION_NOTE,
  CONFIG,
  COURSES,
  NT_COMBO,
  inquiryLink,
  sendTelemetry,
} from '../data/fgiitData';
import Icon from './Icons';

export default function Pricing({ onOpenDemo, onNavigate }) {
  return (
    <section
      id="courses"
      className="wrap section section--flush-bottom"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="head">
        <span className="eyebrow">What you get</span>
        <h2>Everything You Need to Start Your Fitness Career</h2>
        <p className="lead">
          The Nutri-Trainer Combo opens the whole learning experience for all five courses: live
          classes with expert faculty, recorded lessons, digital study material, the app that
          keeps it all in one place, and 100% placement support after completion.
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
                ★ All Courses in One
              </span>
            </div>

            {/* Course name + intro */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 className="price-tag" style={{ margin: 0, fontSize: 'clamp(28px, 3.4vw, 38px)' }}>
                {NT_COMBO.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text2)' }}>
                {NT_COMBO.intro}
              </p>
            </div>

            {/* Quick facts */}
            <div className="chips" style={{ gap: '8px' }}>
              {NT_COMBO.facts.map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: '12.5px',
                    padding: '5px 11px',
                    borderRadius: '999px',
                    background: '#FFFFFF',
                    border: '1px solid #DCE8C4',
                    color: 'var(--text2)',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Courses included */}
            <b style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '-8px' }}>
              Courses included
            </b>
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
              {NT_COMBO.courseIds.map((k) => COURSES[k].name).map((item, idx) => (
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

            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: 'var(--muted)' }}>
              Plus 100% job placement assistance after certification and lifetime revision on the
              FGIIT Academy app.
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="btn-row" style={{ gap: '10px' }}>
                <a
                  className="btn btn-lime"
                  href={inquiryLink(NT_COMBO.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendTelemetry('inquiry_click', { course: NT_COMBO.name })}
                  style={{ minHeight: '52px', flex: '1 1 180px' }}
                >
                  Inquiry Now
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
              <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                Full course · without certificate ·{' '}
                <a href="#inpta" className="tap-link" style={{ fontWeight: 700 }}>
                  Need accreditation only?
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Learning Bento Grid */}
        <div className="includes-grid" style={{ flex: '1 1 500px', minWidth: 0 }}>
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
