import React from 'react';
import { CONFIG } from '../data/fgiitData';

export default function Footer() {
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
          paddingTop: '36px',
          paddingBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '28px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '380px' }}>
          <img
            src="/images/fgiit-logo.png"
            alt="FGIIT Logo"
            width="52"
            height="52"
            style={{ flex: 'none' }}
          />
          <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Fitness with Gomzi International Institute of Teaching. Skill development for fitness and nutrition careers.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', maxWidth: '320px' }}>
          <b style={{ color: 'var(--ink)' }}>Head Office · INPTA</b>
          <span style={{ lineHeight: 1.6 }}>
            2, GOMZI Abhushan Bungalows, Char Rasta, near Alkapuri, Shraddha Society, Katargam, Surat, Gujarat 395008
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
          <b style={{ color: 'var(--ink)' }}>Contact</b>
          <a href={`tel:+${CONFIG.WHATSAPP}`} style={{ fontWeight: 700 }}>
            {CONFIG.PHONE_DISPLAY}
          </a>
          <a href="https://fggroup.in" target="_blank" rel="noopener noreferrer">
            fggroup.in
          </a>
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
