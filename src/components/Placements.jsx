import React, { useRef } from 'react';
import { PLACEMENTS, inquiryLink } from '../data/fgiitData';
import useAutoScroll from '../hooks/useAutoScroll';

export default function Placements() {
  const trackRef = useRef(null);
  useAutoScroll(trackRef, { interval: 3800 });

  return (
    <section id="placements" className="wrap section section--flush-bottom">
      <div className="head">
        <span className="eyebrow">100% placement support · real careers</span>
        <h2>From FGIIT Students to Working Professionals.</h2>
        <p className="lead">
          FGIIT-certified personal trainers, master trainers and dietitians now building real
          careers in the fitness industry — earning from ₹50K up to ₹2.5 Lakh per month.
        </p>
      </div>

      <div
        className="carousel placements-track"
        ref={trackRef}
        role="region"
        aria-label="FGIIT certified students and their careers"
      >
        {PLACEMENTS.map((p) => (
          <figure key={p.file} className="placement-card">
            <img
              src={`/images/placeintern/${p.file}`}
              alt={`${p.name}, FGIIT-certified ${p.role}, earning ₹${p.income} per month`}
              loading="lazy"
              width="1080"
              height="1080"
            />
            <figcaption>
              <span className="placement-tag">{p.role}</span>
              <span className="placement-name">{p.name}</span>
              <span className="placement-meta">Earning ₹{p.income} per month</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="placements-cta">
        <span>Want to be our next success story?</span>
        <a
          className="btn btn-lime"
          href={inquiryLink()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ minHeight: '48px' }}
        >
          Inquiry Now
        </a>
      </div>
    </section>
  );
}
