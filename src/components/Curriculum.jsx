import React from 'react';
import { TIMELINE } from '../data/fgiitData';
import Icon from './Icons';

export default function Curriculum({ onOpenBrochure }) {
  return (
    <section id="journey" className="wrap section">
      <div className="head">
        <span className="eyebrow">Learning journey</span>
        <h2>Your Journey from Beginner to Job-Ready Fitness Professional</h2>
      </div>

      <div className="journey-rail" id="months">
        {TIMELINE.map((stage) => (
          <div key={stage.num} className="journey-step">
            <span className="journey-dot" aria-hidden="true" />
            <span className="journey-num">{stage.num}</span>
            <h3 className="journey-title">{stage.title}</h3>
            <p className="journey-desc">{stage.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '16px' }}>
        <button
          type="button"
          className="btn btn-green"
          onClick={onOpenBrochure}
          style={{ minHeight: '54px', padding: '0 32px' }}
        >
          <Icon name="download" size={18} />
          Download the Complete Course Brochure
        </button>
      </div>
    </section>
  );
}
