import React from 'react';

export default function Accreditation() {
  return (
    <section style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div
        className="wrap"
        style={{
          paddingTop: '18px',
          paddingBottom: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 28px',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          color: 'var(--muted)',
          textAlign: 'center',
        }}
      >
        <span>
          <b style={{ color: 'var(--ink)' }}>INPTA</b> accredited
        </span>
        <span>
          <b style={{ color: 'var(--ink)' }}>IPTNA</b> member
        </span>
        <span>
          <b style={{ color: 'var(--ink)' }}>ISO 9001:2015</b> certified
        </span>
        <span>
          Certificates with <b style={{ color: 'var(--ink)' }}>UIN &amp; QR</b> verification
        </span>
      </div>
    </section>
  );
}
