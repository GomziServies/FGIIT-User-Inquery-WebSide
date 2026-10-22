import React from 'react';
import { CONFIG } from '../data/fgiitData';

function StoreIcon({ store }) {
  if (store === 'apple') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flex: 'none' }}>
        <path d="M16.7 12.8c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.1-2.5.6-.9.9-1.7 1.1-2.3-1-.3-2.6-1.2-2.6-3.5zM14.6 4.9c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.2l-.1.1zm12.2 12.1-2.9-2.9v-.2l2.9-2.9.1.1 3.4 1.9c1 .6 1 1.5 0 2.1l-3.4 1.9h-.1zm-.3.3L12.1 11l-3.4 3.3 3.4 3.4 3.8-2.1-3.4-2.1zM4.2 20.6l8.7-8.7.3.3-8.4 8.4-.6.1c-.1 0-.1-.1 0-.1zM4.2 3.4l8.7 8.7.3-.3L4.8 3.4l-.6-.1c-.1 0-.1.1 0 .1z" />
    </svg>
  );
}

const APP_FEATURES = [
  {
    id: 'live-lectures',
    title: 'Live Lectures',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    ),
  },
  {
    id: 'recorded-sessions',
    title: 'Recorded Sessions',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
  },
  {
    id: 'quizzes',
    title: 'Quizzes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    id: 'exams',
    title: 'Exams',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 15.5l-6-3.27V18c0 2.21 2.69 4 6 4s6-1.79 6-4v-2.77l-6 3.27z" />
      </svg>
    ),
  },
  {
    id: 'books',
    title: 'Books',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.5 1 5.5v15.5c1.45-1.1 3.55-1.5 5.5-1.5 1.95 0 4.05.4 5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5 1.17 0 2.39.15 3.5.5V5zm-2 12c-.9-.23-1.94-.35-3-.35-1.74 0-3.41.42-4.5 1.05V7.48c1.09-.63 2.76-1.05 4.5-1.05 1.06 0 2.1.12 3 .35V17z" />
      </svg>
    ),
  },
];

export default function AppSection() {
  return (
    <section id="app" className="section section--alt">
      <div className="wrap">
        <div className="head head-center" style={{ marginBottom: 'clamp(26px, 3.2vw, 36px)' }}>
          <span className="eyebrow">FGIIT Academy app</span>
          <h2>Learn Anytime, Anywhere with the FGIIT Academy App</h2>
        </div>

        <div className="btn-row app-btn-row">
          <a
            className="btn btn-lime"
            href={CONFIG.APP_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ minHeight: '54px' }}
          >
            <StoreIcon store="play" />
            Download the FGIIT Academy App
          </a>
          <a
            className="btn btn-ghost"
            href={CONFIG.APP_APPLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ minHeight: '54px' }}
          >
            <StoreIcon store="apple" />
            Also on the App Store
          </a>
        </div>

        {/* Embedded scoped styles to guarantee zero mobile whitespace regardless of browser cache */}
        <style>{`
          #app .app-showcase-grid {
            display: grid !important;
            grid-template-columns: 1.12fr 0.88fr !important;
            align-items: center !important;
            gap: clamp(24px, 3.5vw, 48px) !important;
            max-width: 1140px !important;
            margin: 28px auto 0 !important;
            width: 100% !important;
          }
          #app .app-showcase-phones {
            width: 100% !important;
            max-width: 540px !important;
            margin: 0 auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: auto !important;
            min-height: 0 !important;
            padding: 0 !important;
          }
          #app .app-mockup-img {
            width: 100% !important;
            max-width: 540px !important;
            height: auto !important;
            display: block !important;
            margin: 0 auto !important;
            aspect-ratio: 1024 / 682 !important;
            object-fit: contain !important;
            filter: drop-shadow(0 16px 32px rgba(11, 18, 16, 0.08)) !important;
          }
          #app .app-features-card-wrapper {
            width: 100% !important;
            max-width: 440px !important;
            margin: 0 auto !important;
            position: relative !important;
            padding-top: 14px !important;
            box-sizing: border-box !important;
            height: auto !important;
            min-height: 0 !important;
          }
          @media (max-width: 900px) {
            #app .app-showcase-grid {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
              margin: 12px auto 0 !important;
              width: 100% !important;
            }
            #app .app-showcase-phones {
              max-width: 340px !important;
              line-height: 0 !important;
              margin: 0 auto !important;
            }
            #app .app-mockup-img {
              max-width: 340px !important;
              display: block !important;
              filter: drop-shadow(0 8px 18px rgba(11, 18, 16, 0.08)) !important;
            }
            #app .app-features-card-wrapper {
              max-width: 420px !important;
              margin: 6px auto 0 !important;
              padding-top: 10px !important;
              position: relative !important;
            }
          }
          @media (max-width: 560px) {
            #app .app-showcase-grid {
              gap: 4px !important;
              margin: 8px auto 0 !important;
            }
            #app .app-showcase-phones {
              max-width: 300px !important;
            }
            #app .app-mockup-img {
              max-width: 300px !important;
              filter: drop-shadow(0 6px 14px rgba(11, 18, 16, 0.07)) !important;
            }
            #app .app-features-card-wrapper {
              max-width: 100% !important;
              margin: 4px auto 0 !important;
              padding-top: 8px !important;
            }
            #app .app-features-badge {
              left: 16px !important;
              top: -2px !important;
              font-size: 13px !important;
              padding: 5px 14px !important;
            }
            #app .app-features-card {
              padding: 20px 14px 14px 14px !important;
              border-radius: 18px !important;
            }
          }
        `}</style>

        {/* 2-Column Responsive Layout: Mockup Phones on Left + App Features Card on Right */}
        <div className="app-showcase-grid">
          {/* Left Column: 3 iPhones */}
          <div className="app-showcase-phones">
            <img
              src="/images/app/fgiit-app-preview.png"
              alt="FGIIT Academy App on Mobile Devices — My Learning, Curriculum, and Certified Students"
              className="app-mockup-img"
              width="1024"
              height="682"
            />
          </div>

          {/* Right Column: Floating App Features Card */}
          <div className="app-features-card-wrapper">
            <div className="app-features-badge">App Features:</div>
            <div className="app-features-card">
              {APP_FEATURES.map((feat, idx) => (
                <div
                  key={feat.id}
                  className={`app-feature-row ${idx === APP_FEATURES.length - 1 ? 'is-last' : ''}`}
                >
                  <div className="app-feature-icon-circle">
                    {feat.icon}
                  </div>
                  <span className="app-feature-title">{feat.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
