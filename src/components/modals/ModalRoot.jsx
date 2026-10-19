import React, { useEffect, useState } from 'react';
import {
  COURSES,
  CONFIG,
  waLink,
  okPhone,
  okEmail,
  sendTelemetry,
  submitContactInquiry,
  getDemoDays,
} from '../../data/fgiitData';
import { downloadCoachReportPDF } from '../../utils/pdfGenerator';

export default function ModalRoot({ modalState, onClose }) {
  const { type, data } = modalState;

  // Escape key listener & body overflow lock
  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      className="overlay"
      id="overlay"
      onClick={(e) => {
        if (e.target.id === 'overlay') onClose();
      }}
    >
      <div
        className={`dialog${type === 'course' || type === 'report' ? ' wide' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="x"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {type === 'report' && <ReportModalContent report={data} onClose={onClose} />}
        {type === 'course' && <CourseModalContent courseId={data} onClose={onClose} />}
        {type === 'demo' && <DemoModalContent onClose={onClose} />}
        {type === 'apply' && <ApplyExamModalContent initData={data} onClose={onClose} />}
        {type === 'emi' && <EmiModalContent onClose={onClose} />}
      </div>
    </div>
  );
}

/* ================= REPORT MODAL ================= */
function ReportModalContent({ report, onClose }) {
  const { score, totalQuestions, level, cats, weak, userName } = report;
  const circ = 339.3;
  const low = score < 11;
  const firstName = (userName ? userName.split(' ')[0] : 'Your').toUpperCase();
  const counsellorWa = waLink(
    `Hi, I scored ${score}/${totalQuestions} (${level[0]}) on the FGIIT Coach Level Test. I want to know about the Job-Ready Batch.`
  );

  return (
    <div>
      <div
        style={{
          background: 'var(--tint)',
          padding: '24px 28px',
          display: 'flex',
          gap: '22px',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        <div style={{ position: 'relative', width: '116px', height: '116px', flex: 'none' }}>
          <svg width="116" height="116" viewBox="0 0 128 128" aria-hidden="true">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#DDE8C4" strokeWidth="12" />
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="#9BC028"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${((score / totalQuestions) * circ).toFixed(1)} ${circ}`}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="serif" style={{ fontSize: '34px', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              out of {totalQuestions}
            </span>
          </div>
        </div>

        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '36px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '.12em', color: 'var(--deep)', fontWeight: 700 }}>
            {firstName}’S COACH LEVEL
          </span>
          <span className="serif" style={{ fontSize: '28px' }}>
            {level[0]}
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text2)' }}>
            {level[1]}
          </span>
        </div>
      </div>

      <div className="pad">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: '#F4F9E6',
            border: '1px solid #D7E6B4',
            borderRadius: '12px',
            fontSize: '13px',
            color: 'var(--deep)',
            fontWeight: 600,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>Your official assessment report PDF has been downloaded automatically.</span>
        </div>

        <span style={{ fontWeight: 700, fontSize: '15px' }}>Section-wise score</span>
        {cats.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>{c.n}</span>
              <b>
                {c.got}/{c.total}
              </b>
            </div>
            <div style={{ height: '8px', background: '#EEF2F0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${c.p}%`,
                  background: c.color,
                }}
              />
            </div>
          </div>
        ))}

        <div
          style={{
            background: 'var(--tint)',
            border: '1px solid #D7E6B4',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          <b style={{ fontSize: '16px' }}>
            {low ? `You scored ${score}/${totalQuestions}. Your skills need a boost.` : 'Great score! Make it official.'}
          </b>
          <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text2)' }}>
            Your lowest scores were in {weak[0].n} and {weak[1].n}.{' '}
            {low
              ? 'You need more knowledge and practice to work as a high-income coach. Our 6-month Job-Ready Batch takes you there, with a certificate and 100% job placement.'
              : 'Get certified with our 6-month Job-Ready Batch and step into a job with a handsome salary package.'}
          </span>
          <button
            type="button"
            className="btn btn-green"
            onClick={() =>
              downloadCoachReportPDF(report, {
                name: report.userName || 'Candidate',
                email: report.email,
                phone: report.phone,
                status: report.status,
              })
            }
            style={{ minHeight: '52px', gap: '10px' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Official Report (PDF)
          </button>
          <a
            className="btn btn-lime"
            href="#courses"
            onClick={onClose}
            style={{ minHeight: '52px' }}
          >
            Click here to join our 6-month Job-Ready Batch
          </a>
          <a
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
            href={counsellorWa}
          >
            Talk to your counsellor
          </a>
        </div>
      </div>
    </div>
  );
}

/* ================= COURSE MODAL ================= */
function CourseModalContent({ courseId, onClose }) {
  const isNt = courseId === 'nt';
  const c = isNt ? null : COURSES[courseId];
  const price = isNt ? '₹4,777' : '₹2,999';
  const name = isNt ? 'Nutri-Trainer Combo' : c.name;
  const list = isNt
    ? ['pt', 'dn', 'gi', 'ir', 'pl'].map((k) => COURSES[k].name)
    : c.syllabus;
  const facts = isNt
    ? ['5 courses', 'Live + pre-recorded', 'Free e-books (PDF)', 'Without certificate']
    : [c.dur, 'Live + pre-recorded', 'Free e-book (PDF)', 'Without certificate'];
  const buyUrl =
    CONFIG.PAYMENT_LINKS[courseId] ||
    waLink(`Hi, I want to buy the ${name} for ${price}.`);

  return (
    <div>
      <div
        style={{
          background: 'var(--tint)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        <span className="eyebrow">
          {isNt ? 'NUTRI-TRAINER COMBO · ALL COURSES IN ONE' : 'FULL COURSE · ₹2,999'}
        </span>
        <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.2, paddingRight: '48px' }}>
          {name}
        </h2>
        <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text2)' }}>
          {isNt
            ? 'Combination of all our courses except the Steroids Masterclass: personal training, nutrition, group instruction, injury rehab and powerlifting.'
            : c.intro}
        </span>
      </div>

      <div className="pad">
        <div className="chips">
          {facts.map((f, i) => (
            <span
              key={i}
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'var(--bg2)',
                color: 'var(--text2)',
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <b style={{ fontSize: '15px' }}>{isNt ? 'Courses included' : 'Syllabus'}</b>
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '6px 20px',
          }}
        >
          {list.map((item, i) => (
            <div key={i} className="tick">
              <span style={{ color: 'var(--lime)', fontWeight: 800 }}>•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
            paddingTop: '16px',
            borderTop: '1px solid #EEF2F0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="serif" style={{ fontSize: '32px' }}>
              {price}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Full course · without certificate
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              className="btn btn-lime"
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendTelemetry('buy_click', { course: name })}
              style={{ minHeight: '52px' }}
            >
              Buy now · {price}
            </a>
            <a className="btn btn-ghost" href="#certificate" onClick={onClose}>
              Want a certificate?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DEMO MODAL ================= */
function DemoModalContent({ onClose }) {
  const [mode, setMode] = useState('');
  const [day, setDay] = useState('');
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const daysList = getDemoDays();

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'live' && !day) {
      setErr('Please pick a day.');
      return;
    }
    if (mode === 'live' && !slot) {
      setErr('Please pick a time slot.');
      return;
    }
    if (name.trim().length < 2) {
      setErr('Please enter your name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!email.trim() || !okEmail(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }

    setErr('');

    // Submit inquiry to fg-api backend with subject "Demo Class"
    await submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      mobile: phone,
      subject: 'Demo Class',
      message: `Free Demo Class Registration: Email: ${email.trim()}, Type: ${mode === 'rec' ? 'Pre-recorded video' : 'Live real-time class'}${day ? `, Day: ${day}` : ''}${slot ? `, Slot: ${slot}` : ''}`,
      source: window.location.href,
      details: {
        email: email.trim(),
        demoType: mode === 'rec' ? 'Pre-recorded video' : 'Live class',
        day: day || '',
        slot: slot || '',
      },
    });

    await sendTelemetry('demo_class', {
      name: name.trim(),
      phone,
      email: email.trim(),
      demoType: mode === 'rec' ? 'Pre-recorded video' : 'Live class',
      day: day || '',
      slot: slot || '',
    });
    setDone(true);
  };

  return (
    <div className="pad">
      {done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', paddingTop: '8px' }}>
          <span
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--tint2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A630B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h3 style={{ margin: 0, fontSize: '21px' }}>
            {mode === 'rec' ? 'Video on its way!' : 'Your seat is booked!'}
          </h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            {mode === 'rec'
              ? 'You’ll get access to the class video on WhatsApp within 24 hours.'
              : `Live demo on ${day}, ${slot}. We’ll send the class link on WhatsApp.`}
          </p>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      ) : !mode ? (
        <>
          <span className="eyebrow">FREE DEMO CLASS</span>
          <h3 style={{ margin: 0, fontSize: '22px', paddingRight: '40px' }}>
            How would you like to attend?
          </h3>
          <button
            type="button"
            className="opt"
            onClick={() => {
              setMode('rec');
              setErr('');
            }}
          >
            <span className="k">1</span>
            <span>
              <b>Watch a pre-recorded live class</b>
              <br />
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Get the class video on WhatsApp within 24 hours
              </span>
            </span>
          </button>
          <button
            type="button"
            className="opt"
            onClick={() => {
              setMode('live');
              setErr('');
            }}
          >
            <span className="k">2</span>
            <span>
              <b>Join a live real-time class</b>
              <br />
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Pick a day and time, Monday to Saturday
              </span>
            </span>
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'rec' ? (
            <>
              <span className="eyebrow">PRE-RECORDED CLASS</span>
              <h3 style={{ margin: 0, fontSize: '22px', paddingRight: '40px' }}>
                Where should we send the video?
              </h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
                You’ll get access to the class video on WhatsApp within 24 hours.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow">LIVE REAL-TIME CLASS</span>
              <h3 style={{ margin: 0, fontSize: '22px', paddingRight: '40px' }}>
                Pick your day and time
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="lbl">Day (Monday to Saturday)</span>
                <div className="chips">
                  {daysList.map((d) => {
                    const active = day === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setDay(d);
                          if (err) setErr('');
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="lbl">Time slot</span>
                <div className="chips">
                  {CONFIG.DEMO_SLOTS.map(([sl, isFull]) => {
                    const active = slot === sl;
                    return (
                      <button
                        key={sl}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        disabled={isFull}
                        onClick={() => {
                          setSlot(sl);
                          if (err) setErr('');
                        }}
                      >
                        {sl}
                        {isFull ? ' · Seats full' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <label className="field">
            Your name
            <input
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
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
              value={phone}
              onChange={handlePhoneChange}
            />
          </label>
          <label className="field">
            Email ID
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (err) setErr('');
              }}
            />
          </label>

          {err && (
            <div className="err" role="alert">
              {err}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setMode('');
                setErr('');
              }}
            >
              Back
            </button>
            <button type="submit" className="btn btn-green">
              {mode === 'rec' ? 'Send me the video' : 'Book my seat'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ================= APPLY EXAM MODAL ================= */
function ApplyExamModalContent({ initData, onClose }) {
  const { course, price, kind } = initData;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pay, setPay] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const payOptions =
    kind === 'all'
      ? ['Full payment', 'EMI (12 months, 0% interest)']
      : kind === 'big'
      ? ['Full payment', '2-part payment']
      : ['Full payment'];

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErr('Please enter your full name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!okEmail(email)) {
      setErr('Please enter a valid email ID.');
      return;
    }
    if (!city.trim()) {
      setErr('Please enter your city.');
      return;
    }
    if (!pay) {
      setErr('Please choose a payment option.');
      return;
    }

    setErr('');

    // Submit inquiry to fg-api backend with subject "APPLY FOR CERTIFICATE EXAM"
    await submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      mobile: phone,
      subject: 'APPLY FOR CERTIFICATE EXAM',
      message: `Certificate Exam Application: Course: ${course}, Fee: ${price}, Payment: ${pay}, City: ${city.trim()}`,
      source: window.location.href,
      details: {
        certificate: course,
        fee: price,
        paymentOption: pay,
        city: city.trim(),
      },
    });

    await sendTelemetry('certificate_application', {
      certificate: course,
      fee: price,
      name: name.trim(),
      phone,
      email: email.trim(),
      city: city.trim(),
      paymentOption: pay,
    });
    setDone(true);
  };

  return (
    <div className="pad">
      {done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', paddingTop: '8px' }}>
          <span
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--tint2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A630B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h3 style={{ margin: 0, fontSize: '21px' }}>Application received</h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Our team will connect with you within 24 hours with your exam date and payment details.
          </p>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="eyebrow">APPLY FOR CERTIFICATE EXAM</span>
          <h3 style={{ margin: 0, fontSize: '21px', paddingRight: '40px' }}>{course}</h3>
          <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
            Fee: <b>{price}</b> ·{' '}
            {kind === 'all'
              ? 'EMI available'
              : kind === 'big'
              ? '2-part payment available'
              : 'One-time fee'}
          </span>

          <div className="fgrid">
            <label className="field">
              Full name
              <input
                type="text"
                autoComplete="name"
                placeholder="As it should appear on certificate"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
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
                value={phone}
                onChange={handlePhoneChange}
              />
            </label>
            <label className="field">
              Email ID
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr('');
                }}
              />
            </label>
            <label className="field">
              City
              <input
                type="text"
                placeholder="e.g. Surat"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (err) setErr('');
                }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="lbl">Payment option</span>
            <div className="chips">
              {payOptions.map((opt) => {
                const active = pay === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`chip${active ? ' on' : ''}`}
                    aria-pressed={active}
                    onClick={() => {
                      setPay(opt);
                      if (err) setErr('');
                    }}
                  >
                    {opt}
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
            style={{ alignSelf: 'flex-start' }}
          >
            Submit application
          </button>
        </form>
      )}
    </div>
  );
}

/* ================= EMI MODAL ================= */
function EmiModalContent({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [prof, setProf] = useState('');
  const [cibil, setCibil] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAge = parseInt(age, 10);
    if (name.trim().length < 2) {
      setErr('Please enter your full name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!okEmail(email)) {
      setErr('Please enter a valid email ID.');
      return;
    }
    if (!(parsedAge >= 16 && parsedAge <= 80)) {
      setErr('Please enter your age.');
      return;
    }
    if (!prof.trim()) {
      setErr('Please enter your profession.');
      return;
    }
    if (!cibil) {
      setErr('Please choose your CIBIL score.');
      return;
    }

    setErr('');

    // Submit inquiry to fg-api backend with subject "EMI inquiry"
    await submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      mobile: phone,
      subject: 'EMI inquiry',
      message: `EMI Request for Nutri-Trainer ₹54,000 Plan: Age: ${parsedAge}, Profession: ${prof.trim()}, CIBIL: ${cibil}`,
      source: window.location.href,
      details: {
        plan: 'Nutri-Trainer all certificates ₹54,000',
        age: parsedAge,
        profession: prof.trim(),
        cibil,
      },
    });

    await sendTelemetry('emi_request', {
      name: name.trim(),
      phone,
      email: email.trim(),
      age: parsedAge,
      profession: prof.trim(),
      cibil,
      plan: 'Nutri-Trainer all certificates ₹54,000',
    });
    setDone(true);
  };

  return (
    <div className="pad">
      {done ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', paddingTop: '8px' }}>
          <span
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--tint2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A630B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h3 style={{ margin: 0, fontSize: '21px' }}>Thank you!</h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Our team will connect with you within 24 hours to help you get certified as early as possible.
          </p>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="eyebrow">EMI OPTIONS · NUTRI-TRAINER CERTIFICATES</span>
          <h3 style={{ margin: 0, fontSize: '21px', paddingRight: '40px' }}>
            Up to 12 EMIs, 0% interest, 0% down payment
          </h3>
          <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
            ₹54,000 from about <b>₹4,500 a month</b> for 12 months.
          </span>

          <div className="fgrid">
            <label className="field">
              Full name
              <input
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
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
                value={phone}
                onChange={handlePhoneChange}
              />
            </label>
            <label className="field">
              Email ID
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr('');
                }}
              />
            </label>
            <label className="field">
              Age
              <input
                type="number"
                inputMode="numeric"
                placeholder="Years"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (err) setErr('');
                }}
              />
            </label>
            <label className="field">
              Profession
              <input
                type="text"
                placeholder="e.g. Gym trainer, Student"
                value={prof}
                onChange={(e) => {
                  setProf(e.target.value);
                  if (err) setErr('');
                }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="lbl">Your CIBIL score</span>
            <div className="chips">
              {[
                '750+',
                '700+',
                'Less than 700',
                'Low CIBIL (past bounced EMI)',
                'Don’t know',
              ].map((c) => {
                const active = cibil === c;
                return (
                  <button
                    key={c}
                    type="button"
                    className={`chip${active ? ' on' : ''}`}
                    aria-pressed={active}
                    onClick={() => {
                      setCibil(c);
                      if (err) setErr('');
                    }}
                  >
                    {c}
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
            style={{ alignSelf: 'flex-start' }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
