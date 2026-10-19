import React from 'react';
import { waLink } from '../data/fgiitData';

export default function LearnYourWay() {
  const cityWa = waLink('Hi, is the FGIIT offline course available in my city?');

  return (
    <section id="learn" className="wrap sec">
      <div className="head">
        <span className="eyebrow">LEARN YOUR WAY</span>
        <h2>Join live video classes from anywhere, on any device.</h2>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card" style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
          <img
            src="/images/online-zoom.jpg"
            alt="A live FGIIT online class on Zoom"
            style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Live video classes</h3>
            <div className="tick">
              <b>✓</b>
              <span>Join from your phone or laptop, wherever you are</span>
            </div>
            <div className="tick">
              <b>✓</b>
              <span>Pre-recorded lectures to revise anytime</span>
            </div>
            <div className="tick">
              <b>✓</b>
              <span>Free e-book (PDF) for every course</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
          <img
            src="/images/hybrid-wide.jpg"
            alt="FGIIT classroom with offline and online students at the same time"
            style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Feels like sitting in class</h3>
            <div className="tick">
              <b>✓</b>
              <span>Online and classroom batches run live at the same time</span>
            </div>
            <div className="tick">
              <b>✓</b>
              <span>Ask your questions one-on-one with the faculty</span>
            </div>
            <div className="tick">
              <b>✓</b>
              <span>Same faculty, same lesson, same doubt-solving</span>
            </div>
          </div>
        </div>
      </div>

      <span
        style={{
          fontSize: '14px',
          color: 'var(--text2)',
          background: 'var(--bg2)',
          borderRadius: '12px',
          padding: '12px 16px',
        }}
      >
        Offline courses are also available in select cities.{' '}
        <a href={cityWa} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>
          Ask about your city →
        </a>
      </span>
    </section>
  );
}
