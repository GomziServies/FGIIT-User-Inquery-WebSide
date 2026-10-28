import React, { useState, useEffect } from 'react';

const CHOICE_KEY = 'fg_cookie_choice';

export default function CookieConsent({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(CHOICE_KEY);
      if (!choice) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    try { localStorage.setItem(CHOICE_KEY, 'accepted'); } catch {}
    if (window.fgTracker && window.fgTracker.acceptCookies) window.fgTracker.acceptCookies();
    setVisible(false);
  }

  function reject() {
    try { localStorage.setItem(CHOICE_KEY, 'rejected'); } catch {}
    if (window.fgTracker && window.fgTracker.rejectCookies) window.fgTracker.rejectCookies();
    setVisible(false);
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2147483000,
      background: 'rgba(15, 23, 42, 0.97)', backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '0',
      animation: 'fgCookieSlideUp 0.4s ease-out',
    }}>
      <style>{`
        @keyframes fgCookieSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="wrap" style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        padding: '18px 0', maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <p style={{
            margin: 0, color: '#e2e8f0', fontSize: '14px', lineHeight: 1.6,
          }}>
            <span style={{ fontSize: '18px', marginRight: '8px', verticalAlign: 'middle' }}>&#x1F36A;</span>
            We use cookies and browser storage to improve your experience and analyse site traffic.
            Accepting lets our team's CRM save your visit summary (pages viewed, interests, device and
            browser storage) — no personal details are added unless you send a form.{' '}
            <a
              href="/cookie-policy"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('cookie-policy'); } }}
              style={{ color: '#93c5fd', textDecoration: 'underline', fontWeight: 600 }}
            >
              Read our Cookie &amp; Data Policy
            </a>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={reject}
            style={{
              padding: '10px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)',
              background: 'transparent', color: '#cbd5e1', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            Reject All
          </button>
          <button
            type="button"
            onClick={accept}
            style={{
              padding: '10px 24px', borderRadius: '8px', border: 'none',
              background: 'var(--accent, #9BC028)', color: '#fff', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(155, 192, 40, 0.3)',
            }}
            onMouseEnter={(e) => { e.target.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
