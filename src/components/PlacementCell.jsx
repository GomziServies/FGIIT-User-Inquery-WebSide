import React, { useState } from 'react';
import { okPhone, okEmail, sendTelemetry, submitContactInquiry } from '../data/fgiitData';

export default function PlacementCell() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    uin: '',
    city: '',
    loc: '',
    role: '',
  });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: raw }));
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim().length < 2) {
      setErr('Please enter your full name.');
      return;
    }
    if (!okPhone(formData.phone)) {
      setErr('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!formData.email.trim() || !okEmail(formData.email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!formData.uin.trim()) {
      setErr('Please enter your certificate UIN number.');
      return;
    }
    if (!formData.city.trim()) {
      setErr('Please enter your current city.');
      return;
    }
    if (!formData.loc || !formData.role) {
      setErr('Please choose a preferred location and role.');
      return;
    }

    setErr('');

    // Submit inquiry to fg-api backend with subject "Apply for a job"
    await submitContactInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.phone,
      subject: 'Apply for a job',
      message: `Placement Cell Application: Email: ${formData.email.trim()}, UIN: ${formData.uin.trim()}, Current City: ${formData.city.trim()}, Preferred Location: ${formData.loc}, Role: ${formData.role}`,
      source: window.location.href,
      details: {
        email: formData.email.trim(),
        uin: formData.uin.trim(),
        city: formData.city.trim(),
        preferredLocation: formData.loc,
        role: formData.role,
      },
    });

    await sendTelemetry('job_application', {
      name: formData.name.trim(),
      phone: formData.phone,
      email: formData.email.trim(),
      uin: formData.uin.trim(),
      city: formData.city.trim(),
      preferredLocation: formData.loc,
      role: formData.role,
    });
    setDone(true);
  };

  return (
    <section id="placement" className="wrap" style={{ paddingTop: '52px', paddingBottom: '8px' }}>
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* Left Side: Placement info */}
        <div
          style={{
            flex: '1 1 300px',
            minWidth: 0,
            background: 'var(--tint)',
            padding: 'clamp(22px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <span className="eyebrow">PLACEMENT CELL</span>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.2 }}>
            Certified? Apply for a job.
          </h2>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--text2)' }}>
            After your certificate and internship, our placement team places you with gyms, studios and fitness brands in India and abroad.
          </p>
          <div className="tick">
            <b>✓</b>
            <span>100% job placement</span>
          </div>
          <div className="tick">
            <b>✓</b>
            <span>Handsome salary packages</span>
          </div>
          <div className="tick">
            <b>✓</b>
            <span>Internship before placement</span>
          </div>
          <div className="tick">
            <b>✓</b>
            <span>Roles in India and abroad</span>
          </div>
        </div>

        {/* Right Side: Form or Success */}
        <div
          id="jobBox"
          style={{
            flex: '999 1 460px',
            minWidth: 0,
            padding: 'clamp(22px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {done ? (
            <div>
              <h3 style={{ margin: 0, fontSize: '22px' }}>
                Application received, {formData.name.trim().split(' ')[0]}.
              </h3>
              <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
                Our placement team will verify your certificate and contact you on WhatsApp with matching openings.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="fgrid">
                <label className="field">
                  Full name
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="As on certificate"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (err) setErr('');
                    }}
                  />
                </label>
                <label className="field">
                  WhatsApp number
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </label>
                <label className="field">
                  Email ID
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (err) setErr('');
                    }}
                  />
                </label>
                <label className="field">
                  Certificate UIN No.
                  <input
                    type="text"
                    placeholder="e.g. 03102"
                    value={formData.uin}
                    onChange={(e) => {
                      setFormData({ ...formData, uin: e.target.value });
                      if (err) setErr('');
                    }}
                  />
                </label>
                <label className="field">
                  Current city
                  <input
                    type="text"
                    placeholder="e.g. Surat"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (err) setErr('');
                    }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="lbl">Preferred location</span>
                <div className="chips">
                  {['India', 'Abroad', 'Either'].map((loc) => {
                    const active = formData.loc === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setFormData({ ...formData, loc });
                          if (err) setErr('');
                        }}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="lbl">Role you want</span>
                <div className="chips">
                  {[
                    'Personal trainer',
                    'Nutritionist',
                    'Group instructor',
                    'Rehab / strength coach',
                  ].map((role) => {
                    const active = formData.role === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setFormData({ ...formData, role });
                          if (err) setErr('');
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {err && (
                <div className="err" role="alert">
                  {err}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-green"
                style={{ alignSelf: 'flex-start', minWidth: '200px' }}
              >
                Submit application
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
