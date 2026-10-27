import React, { useState } from 'react';
import { CONFIG } from '../data/fgiitData';

export default function Footer({ onNavigate }) {
  const [trackingStopped, setTrackingStopped] = useState(false);

  return (
    <footer
      style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--line)',
        color: 'var(--text2)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className="wrap"
        style={{
          paddingTop: '44px',
          paddingBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '32px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', maxWidth: '360px' }}>
          <img
            src="/images/fgiit-logo.png"
            alt="FGIIT Logo"
            width="48"
            height="48"
            style={{ flex: 'none' }}
          />
          <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Fitness with Gomzi International Institute of Teaching. Skill development for fitness and
            nutrition careers.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', maxWidth: '320px' }}>
          <b style={{ color: 'var(--ink)' }}>Head Office · INPTA</b>
          <span style={{ lineHeight: 1.6 }}>
            2, GOMZI Abhushan Bungalows, Char Rasta, near Alkapuri, Shraddha Society, Katargam, Surat,
            Gujarat 395008
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '14px' }}>
          <b style={{ color: 'var(--ink)', marginBottom: '4px' }}>Contact</b>
          <a href={`tel:+${CONFIG.WHATSAPP}`} className="footer-link" style={{ fontWeight: 700 }}>
            {CONFIG.PHONE_DISPLAY}
          </a>
          <a href="https://fggroup.in" target="_blank" rel="noopener noreferrer" className="footer-link">
            fggroup.in
          </a>
          <a href={CONFIG.INPTA_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
            INPTA Accreditation
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '14px' }}>
          <b style={{ color: 'var(--ink)', marginBottom: '4px' }}>Quick links</b>
          <a href={CONFIG.APP_PLAY_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
            Google Play
          </a>
          <a href={CONFIG.APP_APPLE_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
            App Store
          </a>
          <a
            href="#courses"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('home', 'courses');
              }
            }}
            className="footer-link"
          >
            Courses &amp; fees
          </a>
          <a
            href="/assessment"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('assessment');
              }
            }}
            className="footer-link"
          >
            Trainer Assessment
          </a>
          <a
            href="/cookie-policy"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('cookie-policy');
              }
            }}
            className="footer-link"
          >
            Cookie &amp; Data Policy
          </a>
          <button
            type="button"
            className="footer-link"
            onClick={() => {
              // Withdraws the agreement given when a form was sent: the visitor tracker stops sharing
              // details and visit activity with the CRM from this browser.
              try {
                if (window.fgTracker && window.fgTracker.setConsent) window.fgTracker.setConsent(false);
                else localStorage.setItem('fg_lead_consent', '0');
                localStorage.removeItem('fg_vid');
              } catch {}
              setTrackingStopped(true);
            }}
            style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
          >
            {trackingStopped ? 'Tracking stopped on this device' : 'Stop tracking on this device'}
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)' }}>
        <div
          className="wrap"
          style={{
            paddingTop: '16px',
            paddingBottom: '16px',
            fontSize: '12px',
            color: '#6B7A76',
          }}
        >
          © FGIIT · Fitness with Gomzi International Institute of Teaching
        </div>
      </div>
    </footer>
  );
}
