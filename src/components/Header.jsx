import React from 'react';

export default function Header({ onOpenDemo }) {
  return (
    <header className="top">
      <div className="wrap nav">
        <a
          href="#top"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--ink)',
          }}
          aria-label="FGIIT home"
        >
          <img
            src="/images/fgiit-logo.png"
            alt="FGIIT Logo"
            width="42"
            height="42"
          />
          <span className="serif" style={{ fontSize: '20px' }}>
            FGIIT
          </span>
        </a>
        <nav className="hide-sm" aria-label="Main">
          <a href="#test">Coach Level Test</a>
          <a href="#learn">Online &amp; Offline</a>
          <a href="#courses">Courses ₹2,999</a>
          <a href="#certificate">Certificate only</a>
        </nav>
        <a
          className="btn btn-lime"
          href="#courses"
          style={{ minHeight: '44px', padding: '0 18px' }}
        >
          Join Job-Ready Batch
        </a>
      </div>
    </header>
  );
}
