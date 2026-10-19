import React from 'react';
import { COURSES, COURSE_ORDER } from '../data/fgiitData';

export default function Courses({ onOpenCourse, onOpenBuy }) {
  return (
    <section id="courses" className="wrap sec">
      <div className="head">
        <span className="eyebrow">COURSES · ₹2,999 FULL COURSE</span>
        <h2>Learn any course for just ₹2,999.</h2>
        <p>
          Without certificate, course and knowledge only. Live classes plus pre-recorded lectures, and a free e-book (PDF) with every course. Tap a course to see the full syllabus.
        </p>
      </div>

      <div
        className="grid"
        id="courseGrid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
        }}
      >
        {COURSE_ORDER.map((id) => {
          const c = COURSES[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onOpenCourse(id)}
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: 'var(--ink)',
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--lime)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(11, 18, 16, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '16px', lineHeight: 1.35 }}>
                {c.name}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                {c.dur} · Live + pre-recorded · Free e-book
              </span>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  paddingTop: '8px',
                  marginTop: 'auto',
                  borderTop: '1px solid #EEF2F0',
                  width: '100%',
                }}
              >
                <span className="serif" style={{ fontSize: '24px' }}>
                  {c.price}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep)' }}>
                  View syllabus →
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Nutri-Trainer Combo Card */}
      <button
        type="button"
        onClick={() => onOpenCourse('nt')}
        style={{
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: 'var(--ink)',
          background: 'var(--tint)',
          border: '2px solid var(--lime)',
          borderRadius: '20px',
          padding: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(155, 192, 40, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 320px' }}>
          <span
            style={{
              alignSelf: 'flex-start',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.08em',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--lime)',
            }}
          >
            BEST VALUE · ALL-IN-ONE
          </span>
          <span style={{ fontWeight: 700, fontSize: '19px' }}>
            Nutri-Trainer Combo
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text2)' }}>
            Combination of all courses: Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting. Steroids Masterclass not included. Without certificate, free e-books included.
          </span>
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span className="serif" style={{ fontSize: '34px' }}>
            ₹4,777
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep)' }}>
            View full syllabus →
          </span>
        </span>
      </button>
    </section>
  );
}
