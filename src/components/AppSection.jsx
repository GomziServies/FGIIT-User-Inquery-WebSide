import React, { useRef } from 'react';
import { APP, CONFIG } from '../data/fgiitData';
import useAutoScroll from '../hooks/useAutoScroll';
import Icon from './Icons';

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

export default function AppSection() {
  const galleryRef = useRef(null);
  useAutoScroll(galleryRef, { interval: 3600 });

  return (
    <section id="app" className="section section--alt">
      <div className="wrap">
        <div className="head head-center">
          <span className="eyebrow">FGIIT Academy app</span>
          <h2>Learn Anytime, Anywhere with the FGIIT Academy App</h2>
          <p className="lead" style={{ maxWidth: '640px' }}>
            Live Learning. On-Demand Videos. Digital Study Materials. Everything in One Place.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-head">
              <span className="feature-icon" aria-hidden="true">
                <Icon name="live" size={19} />
              </span>
              <h3 className="feature-title">Live Online Classes</h3>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-head">
              <span className="feature-icon" aria-hidden="true">
                <Icon name="play" size={19} />
              </span>
              <h3 className="feature-title">Pre-Recorded Video Lessons</h3>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-head">
              <span className="feature-icon" aria-hidden="true">
                <Icon name="book" size={19} />
              </span>
              <h3 className="feature-title">Digital E-Books &amp; Study Materials</h3>
            </div>
          </article>
        </div>

        <div className="btn-row" style={{ justifyContent: 'center' }}>
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

        <div className="app-gallery" ref={galleryRef}>
          {APP.shots.map((shot) => (
            <figure key={shot.file} className="app-gallery-item">
              <div className="app-gallery-device">
                <img src={`/images/app/${shot.file}`} alt={shot.alt} loading="lazy" />
              </div>
              <figcaption>{shot.label}</figcaption>
            </figure>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', textAlign: 'center' }}>
          Screenshots from the official FGIIT Academy listings on Google Play and the App Store.
        </p>
      </div>
    </section>
  );
}
