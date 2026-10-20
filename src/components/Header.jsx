import React, { useState } from 'react';

const NAV_LINKS = [
  { href: '#test', label: 'Trainer Level Test' },
  { href: '#courses', label: 'Courses' },
  { href: '#journey', label: 'Learning Journey' },
  { href: '#app', label: 'Academy App' },
  { href: '#inpta', label: 'INPTA' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header({ onOpenDemo }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="top">
      <div className="wrap nav">
        <a
          href="#top"
          onClick={close}
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

        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="btn btn-ghost nav-demo"
            onClick={() => {
              close();
              onOpenDemo();
            }}
            style={{ minHeight: '44px', padding: '0 16px', alignSelf: 'flex-start' }}
          >
            Free demo class
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            className="btn btn-lime"
            href="#price"
            style={{ minHeight: '44px', padding: '0 18px', whiteSpace: 'nowrap' }}
          >
            Enroll · ₹2,999
          </a>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
