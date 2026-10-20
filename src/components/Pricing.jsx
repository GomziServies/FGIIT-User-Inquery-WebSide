import React from 'react';
import { INCLUDES, ACCREDITATION_NOTE } from '../data/fgiitData';
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
          gap: 'clamp(24px, 4vw, 56px)',
          alignItems: 'flex-start',
        }}
      >
        <div className="price-block" style={{ flex: '0 1 260px', minWidth: 0 }}>
          <div className="surface" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="price-tag">₹2,999</span>
              <span className="price-note">Course fee · one eligible course</span>
            </div>
            <div className="btn-row" style={{ marginTop: '20px' }}>
              <a className="btn btn-lime" href="#courses" style={{ minHeight: '52px' }}>
                Enroll Now – ₹2,999
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

        <div
          style={{
            flex: '1 1 520px',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {INCLUDES.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'var(--tint)',
                  color: 'var(--deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={item.icon} />
              </span>
              <h3 style={{ margin: 0, fontSize: '16px', lineHeight: 1.35 }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55, color: 'var(--muted)' }}>
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
          <a href="#inpta" className="tap-link" style={{ fontSize: '14px', fontWeight: 700 }}>
            See how to apply through INPTA →
          </a>
        </div>
      </div>
    </section>
  );
}
