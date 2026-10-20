import React from 'react';

const MARKS = [
  { label: 'INPTA accredited' },
  { label: 'IPTNA member' },
  { label: 'ISO 9001:2015 certified' },
  { label: 'Certificates with UIN & QR verification' },
];

export default function Accreditation() {
  return (
    <section style={{ background: 'var(--bg2)' }}>
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
        {MARKS.map((mark, idx) => (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span
              aria-hidden="true"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--lime)',
                display: 'inline-block',
              }}
            />
            <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{mark.label}</b>
          </span>
        ))}
      </div>
    </section>
  );
}
