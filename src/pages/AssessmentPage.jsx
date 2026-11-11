import React, { useEffect } from 'react';
import CoachLevelQuiz from '../components/CoachLevelQuiz';
import Icon from '../components/Icons';

export default function AssessmentPage({ onOpenReport, onNavigate, onOpenDemo }) {
  useEffect(() => {
    // Update document title for SEO and user clarity
    document.title = 'Trainer Level Assessment | Free 15-Question Diagnostic | FGIIT';
    window.scrollTo(0, 0);

    return () => {
      document.title = 'FGIIT Job-Ready Batch | Nutri-Trainer Combo – 5 Fitness Courses in One';
    };
  }, []);

  return (
    <div className="assessment-page" style={{ paddingTop: '10px' }}>
      {/* Top Breadcrumb & Hero Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F4F9E6 0%, #FFFFFF 100%)',
          borderBottom: '1px solid var(--line)',
          paddingTop: 'clamp(28px, 4vw, 52px)',
          paddingBottom: 'clamp(32px, 4.5vw, 56px)',
        }}
      >
        <div className="wrap">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--muted)',
              marginBottom: '20px',
            }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              style={{
                color: 'var(--deep)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon name="chevronLeft" size={15} />
              <span>Back to Home</span>
            </a>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Trainer Assessment</span>
          </nav>

          <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#FFFFFF',
                border: '1px solid #DCE6D2',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--deep)',
                alignSelf: 'flex-start',
                boxShadow: '0 2px 8px rgba(11, 18, 16, 0.04)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--lime)',
                  display: 'inline-block',
                }}
              />
              100% FREE ONLINE ASSESSMENT · 15 QUESTIONS · 4 MINUTES
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 3.8vw, 46px)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
              }}
            >
              Discover What Level of Fitness Trainer You Are
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 'clamp(16px, 1.6vw, 18.5px)',
                lineHeight: 1.6,
                color: 'var(--text2)',
                maxWidth: '720px',
              }}
            >
              Benchmark your practical coaching, exercise anatomy, client assessment, and nutrition
              knowledge against national fitness standards. Complete all 15 questions to unlock your
              immediate diagnostic PDF report, competency breakdown, and personalized skill roadmap.
            </p>

            {/* Quick Diagnostic Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '8px',
              }}
            >
              {[
                { icon: 'clock', label: 'Takes 4 Minutes' },
                { icon: 'chart', label: '7 Fitness Domains' },
                { icon: 'fileText', label: 'Instant PDF Report' },
                { icon: 'trophy', label: 'Certified Tier Score' },
                { icon: 'chat', label: 'WhatsApp Delivery' },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid var(--line)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    boxShadow: '0 2px 6px rgba(11, 18, 16, 0.03)',
                  }}
                >
                  <Icon name={badge.icon} size={16} style={{ color: 'var(--deep)' }} />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Assessment Section (The 15-Question Interactive Quiz) */}
      <section style={{ position: 'relative' }}>
        <CoachLevelQuiz onOpenReport={onOpenReport} onNavigate={onNavigate} />
      </section>

      {/* Domain Breakdown & Assessment FAQ Section */}
      <section className="wrap section" style={{ paddingTop: '56px', paddingBottom: '64px' }}>
        <div className="head" style={{ maxWidth: '780px', marginBottom: '36px' }}>
          <span className="eyebrow">WHAT IS EVALUATED</span>
          <h2>The 7 Core Domains of Professional Fitness Coaching</h2>
          <p>
            The FGIIT Trainer Level Assessment benchmarks your capabilities across every essential
            competency required by leading gyms, health clubs, and elite athletic facilities.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '52px',
          }}
        >
          {[
            {
              num: '01',
              title: 'Anatomy & Physiology',
              desc: 'Muscle origins, insertions, bioenergetics, joint biomechanics, and cardiorespiratory responses.',
            },
            {
              num: '02',
              title: 'Training & Programming',
              desc: 'Periodization models, progressive overload, volume/intensity prescription, and movement screening.',
            },
            {
              num: '03',
              title: 'Assessment & Safety',
              desc: 'PAR-Q+ administration, postural deviation correction, contraindications, and emergency procedures.',
            },
            {
              num: '04',
              title: 'Sports Nutrition',
              desc: 'Macronutrient calculation, dietary energy balance, hydration strategies, and supplement safety.',
            },
            {
              num: '05',
              title: 'Injury & Rehabilitation',
              desc: 'Common gym injuries, tendon healing phases, corrective exercise, and scope-safe rehab protocols.',
            },
            {
              num: '06',
              title: 'Ethics & Professional Scope',
              desc: 'Trainer liability, medical referral criteria, client confidentiality, and industry ethics standards.',
            },
            {
              num: '07',
              title: 'Client Business & Coaching',
              desc: 'Client consultation conversions, retention strategies, motivational interviewing, and session pacing.',
            },
          ].map((domain, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--line)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(11, 18, 16, 0.04)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--deep)',
                    background: 'var(--tint)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  DOMAIN {domain.num}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--ink)' }}>
                {domain.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--muted)',
                }}
              >
                {domain.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner Card: Explore FGIIT Job-Ready Courses */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B1210 0%, #1A2622 100%)',
            borderRadius: '24px',
            padding: 'clamp(28px, 4vw, 44px)',
            color: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 20px 48px -12px rgba(11, 18, 16, 0.3)',
          }}
        >
          <div style={{ maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--lime)',
              }}
            >
              READY TO UPGRADE YOUR SKILLS?
            </span>
            <h2 style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1.2, color: '#FFFFFF' }}>
              Turn Your Assessment Results into a Professional Career
            </h2>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#C9D5D1' }}>
              Join the FGIIT Job-Ready Batch with live interactive classes, recorded revisions, study
              notes, and 100% placement support with top fitness chains across India.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home', 'courses');
              }}
              className="btn btn-lime"
              style={{ minHeight: '52px', padding: '0 26px' }}
            >
              View Diploma Courses →
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenDemo}
              style={{
                minHeight: '52px',
                padding: '0 24px',
                background: '#FFFFFF',
                color: 'var(--ink)',
                border: '1px solid #FFFFFF',
                fontWeight: 700,
              }}
            >
              ▶ Watch Free Demo Class
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
