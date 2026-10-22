import React from 'react';
import { CONFIG } from '../data/fgiitData';
import Icon from './Icons';

export default function InptaSection({ onApplyCertificate }) {
  return (
    <section id="inpta" className="wrap section">
      <div className="head">
        <span className="eyebrow">INPTA – Indian Nutritionist Personal Trainer Accreditation</span>
        <h2>Get Professionally Accredited Through INPTA</h2>
        <p className="lead">
          INPTA (Indian Nutritionist Personal Trainer Accreditation) is an accreditation organization
          through which eligible applicants can apply for the relevant accreditation and
          certification. If you wish to obtain a certificate, you can apply separately through INPTA.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(20px, 4vw, 48px)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            flex: '1 1 380px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--bg2)',
            borderLeft: '4px solid var(--lime)',
            borderRadius: 'var(--r-md)',
            padding: '20px 22px',
          }}
        >
          <b style={{ fontSize: '15px', color: 'var(--ink)' }}>
            Accreditation and certification are separate from the ₹2,999 course fee.
          </b>
          <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Eligibility, approval and the applicable accreditation fees are as per INPTA. A
            certificate is issued only after the applicable eligibility and approval process is
            completed.
          </span>
        </div>

        <div className="btn-row">
          <button
            type="button"
            className="btn btn-lime"
            onClick={onApplyCertificate}
            style={{ minHeight: '52px' }}
          >
            <Icon name="certificate" size={18} />
            Apply for Your Certificate
          </button>
          <a
            className="btn btn-ghost"
            href={CONFIG.INPTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ minHeight: '52px' }}
          >
            Know More About INPTA
          </a>
        </div>
      </div>
    </section>
  );
}
