import React, { useState } from 'react';
import { COURSES, COURSE_ORDER, COMBO_PRICE } from '../data/fgiitData';
import Icon from './Icons';

export default function Courses({ onOpenCourse, onOpenBuy }) {
  const [filter, setFilter] = useState('all');

  const filteredIds = COURSE_ORDER.filter((id) => {
    if (filter === 'all') return true;
    if (filter === 'diploma') return id === 'pt' || id === 'dn';
    if (filter === 'masterclass') return id !== 'pt' && id !== 'dn';
    return true;
  });

  return (
    <section id="courses" className="wrap section">
      <div className="head" style={{ gap: '14px' }}>
        <span className="eyebrow">Course selection</span>
        <h2>Choose the Course That Fits Your Goals</h2>
        <p style={{ maxWidth: '640px' }}>
          Every course is taught live online with recorded lesson revision, digital study materials,
          and 100% placement support after completion.
        </p>

        {/* Category Filter Tabs */}
        <div className="course-filter-bar" style={{ marginTop: '6px' }}>
          <button
            type="button"
            className={`course-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses ({COURSE_ORDER.length})
          </button>
          <button
            type="button"
            className={`course-filter-btn ${filter === 'diploma' ? 'active' : ''}`}
            onClick={() => setFilter('diploma')}
          >
            Diplomas · 6-8 Months (2)
          </button>
          <button
            type="button"
            className={`course-filter-btn ${filter === 'masterclass' ? 'active' : ''}`}
            onClick={() => setFilter('masterclass')}
          >
            Masterclasses · 1.5 Months (4)
          </button>
        </div>
      </div>

      <div className="course-grid">
        {filteredIds.map((id) => {
          const c = COURSES[id];
          const isDiploma = id === 'pt' || id === 'dn';
          return (
            <article key={id} className="course-tile">
              {/* Card Top: Duration Chip + Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '.05em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: isDiploma ? 'var(--tint)' : 'var(--bg2)',
                    color: isDiploma ? 'var(--deep)' : 'var(--muted)',
                    border: '1px solid',
                    borderColor: isDiploma ? '#D8E8B5' : 'var(--line)',
                  }}
                >
                  {isDiploma ? 'Diploma · 6–8 Mos' : 'Masterclass · 1.5 Mos'}
                </span>
                <span className="course-tile-price">{c.price}</span>
              </div>

              {/* Title & Concise Intro */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 className="course-tile-name" style={{ fontSize: '18px' }}>
                  {c.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    color: 'var(--muted)',
                    minHeight: '42px',
                  }}
                >
                  {c.intro}
                </p>
              </div>

              {/* Quick Curriculum & Delivery Highlights */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  paddingTop: '4px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: 'var(--text2)',
                    background: '#F6F8F7',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  <Icon name="live" size={13} /> Live Classes
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: 'var(--text2)',
                    background: '#F6F8F7',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  <Icon name="layers" size={13} style={{ color: 'var(--deep)' }} /> {c.syllabus.length} Topics
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: 'var(--text2)',
                    background: '#F6F8F7',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  <Icon name="book" size={13} style={{ color: 'var(--deep)' }} /> Free E-Book
                </span>
              </div>

              {/* Clean Symmetrical Action Buttons */}
              <div className="course-tile-actions" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onOpenCourse(id)}
                  style={{
                    minHeight: '44px',
                    flex: '1 1 120px',
                    fontSize: '13.5px',
                    padding: '0 12px',
                  }}
                >
                  Syllabus
                </button>
                <button
                  type="button"
                  className="btn btn-lime"
                  onClick={() => onOpenBuy(id)}
                  style={{
                    minHeight: '44px',
                    flex: '1 1 120px',
                    fontSize: '13.5px',
                    padding: '0 12px',
                  }}
                >
                  Enroll Now
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Nutri-Trainer Master Combo Banner */}
      <div
        onClick={() => onOpenCourse('nt')}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          background: 'linear-gradient(135deg, #F4F9E6 0%, #FFFFFF 100%)',
          border: '2px solid #D6E8B0',
          borderRadius: 'var(--r-xl)',
          padding: 'clamp(24px, 3.5vw, 36px)',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(155, 192, 40, 0.12)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 340px' }}>
          <span
            style={{
              alignSelf: 'flex-start',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '.06em',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'var(--lime)',
              color: 'var(--ink)',
            }}
          >
            BEST VALUE · ALL-IN-ONE PASS
          </span>
          <h3 style={{ margin: 0, fontSize: '22px' }}>Nutri-Trainer Master Combo</h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.55, color: 'var(--text2)' }}>
            Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting
            together. Complete 360° fitness coaching career mastery with free e-books.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--deep)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {COMBO_PRICE}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
              5 Courses Included
            </span>
          </div>
          <button
            type="button"
            className="btn btn-lime"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCourse('nt');
            }}
            style={{ minHeight: '48px', padding: '0 24px' }}
          >
            Explore Combo
          </button>
        </div>
      </div>
    </section>
  );
}

