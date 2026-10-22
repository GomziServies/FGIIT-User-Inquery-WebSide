import React from 'react';

const ACCREDITATIONS = [
  {
    logo: '/images/accreditation/inpta-logo.png',
    logoWidth: 84,
    title: 'INPTA Accredited',
    subtitle: 'Indian Nutritionist Personal Trainer Accreditation',
  },
  {
    logo: '/images/accreditation/iptna-logo.png',
    logoWidth: 44,
    title: 'IPTNA Member',
    subtitle: 'International Professional Network',
  },
  {
    logo: '/images/accreditation/iso-logo.png',
    logoWidth: 44,
    title: 'ISO 9001:2015',
    subtitle: 'Certified Quality Education',
  },
  {
    logo: '/images/accreditation/qr-code.png',
    logoWidth: 44,
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
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
              background: '#FFFFFF',
              border: '1px solid #E4EAE6',
              boxShadow: '0 2px 8px rgba(11, 18, 16, 0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div
              style={{
                width: `${item.logoWidth || item.iconWidth || 44}px`,
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.title}
                  style={{
                    maxHeight: '40px',
                    maxWidth: `${item.logoWidth || 44}px`,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  loading="lazy"
                />
              ) : (
                <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.icon}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: 'var(--muted)',
                  lineHeight: 1.35,
                  marginTop: '1px',
                }}
              >
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

