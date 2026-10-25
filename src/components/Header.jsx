import React, { useState } from 'react';
import { smoothScrollTo } from '../utils/scroll';

const NAV_LINKS = [
  { key: 'courses', href: '#courses', label: 'Courses' },
  { key: 'assessment', href: '/assessment', label: 'Assessment' },
  { key: 'journey', href: '#journey', label: 'Learning Journey' },
  { key: 'app', href: '#app', label: 'Academy App' },
  { key: 'inpta', href: '#inpta', label: 'INPTA' },
  { key: 'faq', href: '#faq', label: 'FAQ' },
];

export default function Header({ onOpenDemo, currentPage = 'home', onNavigate }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLinkClick = (link, e) => {
    e.preventDefault();
    close();
    if (link.key === 'assessment') {
      if (onNavigate) {
        onNavigate('assessment');
      } else {
        window.location.href = '/assessment';
      }
    } else {
      const targetHash = link.href.replace('#', '');
      if (currentPage !== 'home' && onNavigate) {
        onNavigate('home', targetHash);
      } else {
        window.history.pushState({ page: 'home' }, '', `/#${targetHash}`);
        smoothScrollTo(targetHash);
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    close();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    close();
    if (currentPage !== 'home' && onNavigate) {
      onNavigate('home', 'courses');
    } else {
      window.history.pushState({ page: 'home' }, '', '/#courses');
      smoothScrollTo('courses');
    }
  };

  return (
    <header className="top">
      <div className="wrap nav">
        <a
          href="/"
          onClick={handleLogoClick}
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
        </a>

        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main">
          {NAV_LINKS.map((link) => {
            const isActive = link.key === 'assessment' && currentPage === 'assessment';
            return (
              <a
                key={link.key}
                href={link.href}
                className={isActive ? 'active' : ''}
                onClick={(e) => handleLinkClick(link, e)}
              >
                {link.label}
              </a>
            );
          })}
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
            href="#courses"
            onClick={handleEnrollClick}
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
