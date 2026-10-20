import React from 'react';
import { waLink } from '../data/fgiitData';

const MODES = [
  {
    img: '/images/online-zoom.jpg',
    alt: 'A live FGIIT online class on Zoom',
    title: 'Live video classes',
    points: [
      'Join from your phone or laptop, wherever you are',
      'Pre-recorded lectures to revise anytime',
      'Free e-book (PDF) for every course',
    ],
  },
  {
    img: '/images/hybrid-wide.jpg',
    alt: 'FGIIT classroom with offline and online students at the same time',
    title: 'Feels like sitting in class',
    points: [
      'Online and classroom batches run live at the same time',
      'Ask your questions one-on-one with the faculty',
      'Same faculty, same lesson, same doubt-solving',
    ],
  },
];

export default function LearnYourWay() {
  const cityWa = waLink('Hi, is the FGIIT offline course available in my city?');

  return (
    <section id="learn" className="wrap section section--tight section--flush-bottom">
      <div className="head">
        <span className="eyebrow">Learn your way</span>
        <h2>Join live video classes from anywhere, on any device.</h2>
      </div>

      <div className="photo-strip">
        {MODES.map((mode) => (
          <figure key={mode.title} style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="photo-frame">
              <img src={mode.img} alt={mode.alt} loading="lazy" />
            </div>
            <h3 style={{ margin: '18px 0 0', fontSize: '17px' }}>{mode.title}</h3>
            <ul className="checklist" style={{ marginTop: '10px', gap: '8px' }}>
              {mode.points.map((p) => (
                <li key={p} style={{ fontSize: '14px' }}>
                  <span className="tick-ico" aria-hidden="true" style={{ width: '20px', height: '20px', fontSize: '11px' }}>
                    ✓
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </figure>
        ))}
      </div>

      <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text2)' }}>
        Offline courses are also available in select cities.{' '}
        <a href={cityWa} target="_blank" rel="noopener noreferrer" className="tap-link" style={{ fontWeight: 700 }}>
          Ask about your city →
        </a>
      </p>
    </section>
  );
}
