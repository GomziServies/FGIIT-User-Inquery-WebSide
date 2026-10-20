import React from 'react';
import { COURSES, COURSE_ORDER, COMBO_PRICE } from '../data/fgiitData';
import Icon from './Icons';

const keyOutcomes = (syllabus) => {
  if (!syllabus || syllabus.length === 0) return [];
  if (syllabus.length <= 3) return syllabus;
  return [syllabus[0], syllabus[Math.floor(syllabus.length / 2)], syllabus[syllabus.length - 1]];
};

export default function Courses({ onOpenCourse, onOpenBuy }) {
  return (
    <section id="courses" className="wrap section">
      <div className="head">
        <span className="eyebrow">Course selection</span>
        <h2>Choose the Course That Fits Your Goals</h2>
        <p>
          Every course is taught live online with recorded lessons and a free e-book. Open a course
          to read its complete syllabus, or enrol straight away.
        </p>
      </div>

      <div className="course-grid">
        {COURSE_ORDER.map((id) => {
          const c = COURSES[id];
          return (
            <article key={id} className="course-tile">
              <div className="course-tile-head">
                <h3 className="course-tile-name">{c.name}</h3>
                <span className="course-tile-price">{c.price}</span>
              </div>

              <div className="course-tile-block">
                <span className="course-tile-label">What you will learn</span>
                <ul className="course-tile-list">
                  {keyOutcomes(c.syllabus).map((s) => (
                    <li key={s}>
                      <span className="tick-ico" aria-hidden="true">
                        ✓
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="course-tile-block">
                <span className="course-tile-label">Learning format</span>
                <span className="course-tile-format">
                  <Icon name="live" size={15} />
                  {c.dur} · Live online + recorded · Free e-book
                </span>
              </div>

              <div className="course-tile-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onOpenCourse(id)}
                  style={{ minHeight: '44px', flex: '1 1 140px' }}
                >
                  Explore Course
                </button>
                <button
                  type="button"
                  className="btn btn-lime"
                  onClick={() => onOpenBuy(id)}
                  style={{ minHeight: '44px', flex: '1 1 140px' }}
                >
                  Enroll Now
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Nutri-Trainer Combo */}
      <button
        type="button"
        onClick={() => onOpenCourse('nt')}
        className="combo-tile"
        style={{
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: 'var(--ink)',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 320px' }}>
          <span
            style={{
              alignSelf: 'flex-start',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.08em',
              padding: '5px 11px',
              borderRadius: '999px',
              background: 'var(--lime)',
            }}
          >
            BEST VALUE · ALL-IN-ONE
          </span>
          <span style={{ fontWeight: 700, fontSize: '20px' }}>Nutri-Trainer Combo</span>
          <span style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--text2)' }}>
            Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting
            together. Steroids Masterclass not included. Free e-books included.
          </span>
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span className="serif" style={{ fontSize: '36px' }}>
            {COMBO_PRICE}
          </span>
          <span className="course-link">View full syllabus →</span>
        </span>
      </button>
    </section>
  );
}
