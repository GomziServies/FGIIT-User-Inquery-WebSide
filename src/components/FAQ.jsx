import React from 'react';
import { FAQS } from '../data/fgiitData';

export default function FAQ() {
  return (
    <section id="faq" className="wrap section section--flush-bottom">
      <div className="head head-center">
        <span className="eyebrow">Questions</span>
        <h2>Frequently asked</h2>
      </div>

      <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto' }}>
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
