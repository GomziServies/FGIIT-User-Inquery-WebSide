import React from 'react';

const ACCREDITATIONS = [
  {
    icon: '🛡️',
    title: 'INPTA Accredited',
    subtitle: 'Indian Nutritionist Personal Trainer Accreditation',
  },
  {
    icon: '🏛️',
    title: 'IPTNA Member',
    subtitle: 'International Professional Network',
  },
  {
    icon: '🏅',
    title: 'ISO 9001:2015',
    subtitle: 'Certified Quality Education',
  },
  {
    icon: '🔒',
    title: 'UIN & QR Verified',
    subtitle: 'Tamper-Proof Online Verification',
  },
];

export default function Accreditation() {
  return (
    <section
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '16px 0',
      }}
    >
      <div
        className="wrap"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {ACCREDITATIONS.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: 'var(--bg2)',
              border: '1px solid #EAF0EC',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <span style={{ fontSize: '22px', flex: 'none', lineHeight: 1 }}>{item.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {item.title}
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.3 }}>
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

