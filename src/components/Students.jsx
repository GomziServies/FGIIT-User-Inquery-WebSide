import React, { useRef } from 'react';
import { COACHES } from '../data/fgiitData';
import useAutoScroll from '../hooks/useAutoScroll';

export default function Students() {
  const studentsRef = useRef(null);
  useAutoScroll(studentsRef, { interval: 4200 });

  return (
    <section id="students" className="wrap section section--flush-bottom">
      <div className="head">
        <span className="eyebrow">Real students · real accreditation</span>
        <h2>Real Students. Recognized Accreditation.</h2>
        <p className="lead">
          Explore real student success stories from FGIIT courses. Accreditation and certification
          are issued separately through INPTA and are never bundled into the ₹2,999 course fee.
        </p>
      </div>

      <div
        className="carousel carousel--4"
        id="coaches"
        ref={studentsRef}
        role="region"
        aria-label="FGIIT certified students"
      >
        {COACHES.map((coach, idx) => (
          <figure
            key={idx}
            style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <img
              className="carousel-img"
              style={{ aspectRatio: '2 / 3' }}
              src={`/images/${coach.file}`}
              alt={`${coach.name}, ${coach.course}`}
              loading="lazy"
            />
            <figcaption style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{coach.name}</span>
              <span style={{ fontSize: '12.5px', lineHeight: 1.4, color: 'var(--muted)' }}>
                {coach.course}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
