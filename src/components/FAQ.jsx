import React from 'react';
import { FAQS } from '../data/fgiitData';

export default function FAQ() {
  return (
    <section
      className="wrap"
      style={{
        maxWidth: '820px',
        paddingTop: '52px',
        paddingBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center' }}>
        <span className="eyebrow">QUESTIONS</span>
        <h2 className="h2">Frequently asked</h2>
      </div>

      <div>
        {FAQS.map((faq, idx) => (
          <details key={idx}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
