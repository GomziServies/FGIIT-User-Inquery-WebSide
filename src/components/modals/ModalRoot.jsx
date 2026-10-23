import React, { useEffect, useState } from 'react';
import {
  COURSES,
  COURSE_ORDER,
  CERT_OPTIONS,
  BROCHURE_FILES,
  CONFIG,
  waLink,
  okPhone,
  okEmail,
  sendTelemetry,
  dispatchInquiryInBackground,
  getDemoDays,
  getUserProfile,
  saveUserProfile,
} from '../../data/fgiitData';

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
        {type === 'buy' && <CourseBuyFormContent courseId={data} onClose={onClose} />}
        {type === 'demo' && <DemoModalContent onClose={onClose} />}
        {type === 'certapply' && <CertificateApplyModalContent onClose={onClose} />}
        {type === 'brochure' && <BrochureModalContent onClose={onClose} />}
      </div>
    </div>
  );
}

/* ================= REPORT MODAL ================= */
function ReportModalContent({ report, onClose }) {
  const { score, totalQuestions, level, cats, weak, userName, fileUrl, inquirySaved } = report;
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
          <span style={{ flex: 1 }}>Your official assessment report PDF has been downloaded automatically.</span>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              Also emailed to you →
            </a>
          )}
        </div>

        {inquirySaved === false && (
          <div
            style={{
              padding: '12px 14px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#991B1B',
            }}
          >
            We could not save your details to our system just now. Please keep the downloaded report
            and WhatsApp us on +91 88668 42520 so we can follow up with you.
          </div>
        )}

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
            href="#fee"
            onClick={onClose}
            style={{ minHeight: '52px' }}
          >
            Join the 6-month Job-Ready Batch
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

/* ================= COURSE BUY FORM MODAL ================= */
function CourseBuyFormContent({ courseId, onClose, onBack }) {
  const isNt = courseId === 'nt';
  const c = isNt ? null : COURSES[courseId];
  const price = isNt ? '₹4,999' : (c?.price || '₹2,999');
  const courseName = isNt ? 'Nutri-Trainer Combo' : (c?.name || 'Course');

  const [name, setName] = useState(() => getUserProfile()?.name || '');
  const [phone, setPhone] = useState(() => getUserProfile()?.phone || '');
  const [email, setEmail] = useState(() => getUserProfile()?.email || '');
  const [err, setErr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveUserProfile({ name: val });
    if (err) setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    saveUserProfile({ phone: raw });
    if (err) setErr('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    saveUserProfile({ email: val });
    if (err) setErr('');
  };

  const paymentLink = CONFIG.PAYMENT_LINKS?.[courseId] || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErr('Please enter your full name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid 10-digit contact number.');
      return;
    }
    if (!email.trim() || !okEmail(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }

    setErr('');

    // Persist latest details so user doesn't have to re-enter
    saveUserProfile({
      name: name.trim(),
      phone,
      email: email.trim(),
    });

    // Instant UI transition - zero latency for user
    setDone(true);
    setIsSubmitting(false);

    // Background delivery of inquiry & email notification
    dispatchInquiryInBackground(
      {
        name: name.trim(),
        email: email.trim(),
        mobile: phone,
        subject: courseName,
        message: `Course Enrollment Request Submitted Successfully:\n- Course: ${courseName}\n- Fee: ${price}\n- Client Name: ${name.trim()}\n- Contact No (WhatsApp): +91 ${phone}\n- Email: ${email.trim()}\n- Client Notification: "Your request is submitted successfully. Within 24 hours our team will contact you."\n- Channels: WhatsApp (+91 ${phone}) & Email (${email.trim()})\n- SLA: Response guaranteed within 24 hours\n- Submitted At: ${new Date().toLocaleString('en-IN')}`,
        source: window.location.href,
        details: {
          courseId,
          courseName,
          price,
          studentName: name.trim(),
          contactNumber: phone,
          email: email.trim(),
          leadType: 'course_purchase_buy_now',
          clientNotice: 'Your request is submitted successfully. Within 24 hours our team will contact you.',
          contactSla: '24 hours',
          notifyChannels: ['whatsapp', 'email'],
          clientPhone: phone,
          clientEmail: email.trim(),
          submittedAt: new Date().toISOString(),
        },
      },
      {
        telemetry: {
          type: 'course_purchase_lead',
          data: {
            courseId,
            courseName,
            price,
            name: name.trim(),
            phone,
            email: email.trim(),
          },
        },
      }
    );
  };

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
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--deep)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              alignSelf: 'flex-start',
              marginBottom: '2px',
            }}
          >
            ← Back to syllabus
          </button>
        )}
        <span className="eyebrow">
          COURSE ENROLLMENT · {price}
        </span>
        <h2 style={{ margin: 0, fontSize: 'clamp(22px, 2.8vw, 28px)', lineHeight: 1.2, paddingRight: '48px' }}>
          {courseName}
        </h2>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
          Enter your contact details. Our team will contact you within 24 hours on WhatsApp &amp; Email.
        </span>
      </div>

      <div className="pad">
        {done ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start', paddingTop: '8px' }}>
            <span
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--tint2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4A630B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="eyebrow" style={{ color: 'var(--deep)' }}>REQUEST SUBMITTED SUCCESSFULLY</span>
            <h3 style={{ margin: 0, fontSize: '22px' }}>Your request is submitted successfully!</h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--text2)' }}>
              Thank you, <b>{name}</b>! Within 24 hours our team will contact you on WhatsApp and Email regarding your request for <b>{courseName}</b> ({price}).
            </p>

            {/* Notification Highlights Box */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: 'var(--tint)',
                border: '1px solid #D7E6B4',
                borderRadius: '14px',
                padding: '14px 16px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--ink)' }}>
                <span style={{ fontSize: '18px' }}>💬</span>
                <span>
                  <b>WhatsApp:</b> Message will be sent to <b>+91 {phone}</b> within 24 hours.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--ink)' }}>
                <span style={{ fontSize: '18px' }}>✉️</span>
                <span>
                  <b>Email:</b> Confirmation details will be sent to <b>{email}</b> within 24 hours.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--deep)', fontWeight: 700, paddingTop: '6px', borderTop: '1px solid #E2EEC8' }}>
                <span style={{ fontSize: '14px' }}>⏱️</span>
                <span>Our team will contact you within 24 hours guaranteed</span>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg2)',
                borderRadius: '14px',
                border: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '.05em' }}>SELECTED COURSE</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{courseName}</div>
              </div>
              <div className="serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--deep)' }}>{price}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', paddingTop: '4px' }}>
              {paymentLink ? (
                <>
                  <a
                    className="btn btn-lime"
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: '1 1 200px', minHeight: '50px' }}
                  >
                    Proceed to Payment →
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onClose}
                    style={{ minHeight: '50px' }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-lime"
                  onClick={onClose}
                  style={{ width: '100%', minHeight: '50px' }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {err && <div className="err">{err}</div>}

            <div
              style={{
                padding: '12px 16px',
                background: 'var(--bg2)',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
              }}
            >
              <span style={{ color: 'var(--text2)', fontWeight: 600 }}>
                Course Fee · Knowledge only
              </span>
              <span className="serif" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
                {price}
              </span>
            </div>

            <label className="field">
              <span>Full Name <b style={{ color: '#e11d48' }}>*</b></span>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={handleNameChange}
              />
            </label>

            <label className="field">
              <span>Contact Number <b style={{ color: '#e11d48' }}>*</b></span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    pointerEvents: 'none',
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={handlePhoneChange}
                  style={{ paddingLeft: '48px' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                We will send course access details to this number.
              </span>
            </label>

            <label className="field">
              <span>Email Address <b style={{ color: '#e11d48' }}>*</b></span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. rahul@gmail.com"
                value={email}
                onChange={handleEmailChange}
              />
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                Login credentials and confirmation will be sent to this email.
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-lime"
              disabled={isSubmitting}
              style={{
                minHeight: '52px',
                fontSize: '16px',
                width: '100%',
                marginTop: '6px',
              }}
            >
              {isSubmitting ? 'Saving inquiry...' : `Buy now · ${price}`}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--muted)',
                textAlign: 'center',
              }}
            >
              <span>⏱️</span>
              <span>Within 24 hours our team will contact you on WhatsApp &amp; Email</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= COURSE MODAL ================= */
function CourseModalContent({ courseId, onClose }) {
  const [isBuying, setIsBuying] = useState(false);

  const isNt = courseId === 'nt';
  const c = isNt ? null : COURSES[courseId];
  const price = isNt ? '₹4,999' : '₹2,999';
  const name = isNt ? 'Nutri-Trainer Combo' : c.name;
  const list = isNt
    ? ['pt', 'dn', 'gi', 'ir', 'pl'].map((k) => COURSES[k].name)
    : c.syllabus;
  const facts = isNt
    ? ['5 courses', 'Live + pre-recorded', 'Free e-books (PDF)', 'Without certificate']
    : [c.dur, 'Live + pre-recorded', 'Free e-book (PDF)', 'Without certificate'];

  if (isBuying) {
    return (
      <CourseBuyFormContent
        courseId={courseId}
        onClose={onClose}
        onBack={() => setIsBuying(false)}
      />
    );
  }

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
          {isNt ? 'NUTRI-TRAINER COMBO · ALL COURSES IN ONE' : `FULL COURSE · ${price}`}
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
            <button
              type="button"
              className="btn btn-lime"
              onClick={() => {
                sendTelemetry('buy_click', { course: name });
                setIsBuying(true);
              }}
              style={{ minHeight: '52px' }}
            >
              Buy now · {price}
            </button>
            <a className="btn btn-ghost" href="#inpta" onClick={onClose}>
              Need accreditation only?
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
  const [name, setName] = useState(() => getUserProfile()?.name || '');
  const [phone, setPhone] = useState(() => getUserProfile()?.phone || '');
  const [email, setEmail] = useState(() => getUserProfile()?.email || '');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const daysList = getDemoDays();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveUserProfile({ name: val });
    if (err) setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    saveUserProfile({ phone: raw });
    if (err) setErr('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    saveUserProfile({ email: val });
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

    // Persist details
    saveUserProfile({
      name: name.trim(),
      phone,
      email: email.trim(),
    });

    // Instant UI transition - zero latency for user
    setDone(true);

    // Background delivery of inquiry & email notification
    dispatchInquiryInBackground(
      {
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
      },
      {
        telemetry: {
          type: 'demo_class',
          data: {
            name: name.trim(),
            phone,
            email: email.trim(),
            demoType: mode === 'rec' ? 'Pre-recorded video' : 'Live class',
            day: day || '',
            slot: slot || '',
          },
        },
      }
    );
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
              onChange={handleNameChange}
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
              onChange={handleEmailChange}
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


/* ================= CERTIFICATE APPLICATION (INPTA) MODAL ================= */
function CertificateApplyModalContent({ onClose }) {
  const [name, setName] = useState(() => getUserProfile()?.name || '');
  const [phone, setPhone] = useState(() => getUserProfile()?.phone || '');
  const [email, setEmail] = useState(() => getUserProfile()?.email || '');
  const [city, setCity] = useState(() => getUserProfile()?.city || '');
  const [course, setCourse] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveUserProfile({ name: val });
    if (err) setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    saveUserProfile({ phone: raw });
    if (err) setErr('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    saveUserProfile({ email: val });
    if (err) setErr('');
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    saveUserProfile({ city: val });
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
    if (!email.trim() || !okEmail(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!city.trim()) {
      setErr('Please enter your city.');
      return;
    }
    if (!course) {
      setErr('Please choose the accreditation you are applying for.');
      return;
    }

    setErr('');

    // Persist details
    saveUserProfile({
      name: name.trim(),
      phone,
      email: email.trim(),
      city: city.trim(),
    });

    // Instant UI transition - zero latency for user
    setDone(true);
    setIsSubmitting(false);

    // Background delivery of inquiry & email notification
    dispatchInquiryInBackground(
      {
        name: name.trim(),
        email: email.trim(),
        mobile: phone,
        subject: `APPLY FOR CERTIFICATE EXAM: ${option?.name || course}`,
        message: [
          'INPTA Accreditation Application',
          `Accreditation: ${option?.name || course}`,
          `Applicable fee (as published): ${option?.fee || ''}`,
          `City: ${city.trim()}`,
          'Note: Eligibility, approval and certification fees are as per INPTA. Application submission does not guarantee approval.',
        ].join('\n'),
        source: window.location.href,
        details: {
          accreditation: option?.name || course,
          fee: option?.fee || '',
          city: city.trim(),
          course,
        },
      },
      {
        telemetry: {
          type: 'certificate_application',
          data: {
            accreditation: option?.name || course,
            fee: option?.fee || '',
            name: name.trim(),
            phone,
            email: email.trim(),
            city: city.trim(),
          },
        },
      }
    );
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4A630B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="eyebrow" style={{ color: 'var(--deep)' }}>APPLICATION RECEIVED</span>
          <h3 style={{ margin: 0, fontSize: '21px' }}>Your certificate application is with our team</h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Thank you, {name.trim()}. We will contact you on WhatsApp and email within 24 hours with
            the eligibility criteria, the approval process and the applicable fees for your
            application.
          </p>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="eyebrow">APPLY FOR YOUR CERTIFICATE</span>
          <h3 style={{ margin: 0, fontSize: '21px', paddingRight: '40px' }}>
            INPTA accreditation application
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
            Accreditation and certification are separate from the ₹2,999 course fee. Your
            application is reviewed by our team, and approval, eligibility and the applicable
            certification fees are as per INPTA.
          </p>

          <div className="fgrid">
            <label className="field">
              Full name
              <input
                type="text"
                autoComplete="name"
                placeholder="As it should appear on the certificate"
                value={name}
                onChange={handleNameChange}
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
                onChange={handleEmailChange}
              />
            </label>
            <label className="field">
              City
              <input
                type="text"
                placeholder="e.g. Surat"
                value={city}
                onChange={handleCityChange}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="lbl">Accreditation you are applying for</span>
            <div className="chips">
              {CERT_OPTIONS.map((opt) => {
                const active = course === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`chip${active ? ' on' : ''}`}
                    aria-pressed={active}
                    onClick={() => {
                      setCourse(opt.id);
                      if (err) setErr('');
                    }}
                  >
                    {opt.name} · {opt.fee}
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
            className="btn btn-lime"
            disabled={isSubmitting}
            style={{ alignSelf: 'flex-start', minHeight: '50px' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit application'}
          </button>
        </form>
      )}
    </div>
  );
}

/* ================= COURSE BROCHURE DOWNLOAD MODAL ================= */
function BrochureModalContent({ onClose }) {
  const [name, setName] = useState(() => getUserProfile()?.name || '');
  const [phone, setPhone] = useState(() => getUserProfile()?.phone || '');
  const [email, setEmail] = useState(() => getUserProfile()?.email || '');
  const [address, setAddress] = useState(() => getUserProfile()?.address || '');
  const [course, setCourse] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    ...COURSE_ORDER.map((id) => ({ id, name: COURSES[id].name })),
    { id: 'nt', name: 'Nutri-Trainer Combo (all courses)' },
  ];

  const courseName = (options.find((o) => o.id === course) || {}).name || '';
  const brochureFile = BROCHURE_FILES[course] || 'FGIIT_Course_Brochure.pdf';
  const brochureHref = `/images/brochure/${brochureFile}`;

  // Downloads the pre-generated brochure for the chosen course (falls back to
  // building it in the browser if the static file is not available).
  const deliverBrochure = async () => {
    try {
      const res = await fetch(brochureHref, { method: 'HEAD' });
      if (res.ok) {
        const link = document.createElement('a');
        link.href = brochureHref;
        link.download = brochureFile;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }
    } catch (headErr) {
      console.warn('[FGIIT] Brochure file not found, generating in browser:', headErr);
    }
    try {
      const { downloadCourseBrochurePDF } = await import('../../utils/brochureGenerator');
      downloadCourseBrochurePDF(course);
    } catch (genErr) {
      console.warn('[FGIIT] Fallback brochure generation error:', genErr);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveUserProfile({ name: val });
    if (err) setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    saveUserProfile({ phone: raw });
    if (err) setErr('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    saveUserProfile({ email: val });
    if (err) setErr('');
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    saveUserProfile({ address: val });
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
    if (!email.trim() || !okEmail(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (address.trim().length < 5) {
      setErr('Please enter your address.');
      return;
    }
    if (!course) {
      setErr('Please choose the course you are interested in.');
      return;
    }

    setErr('');

    // Persist details
    saveUserProfile({
      name: name.trim(),
      phone,
      email: email.trim(),
      address: address.trim(),
    });

    // Deliver brochure immediately to user
    deliverBrochure().catch((pdfErr) => {
      console.error('[FGIIT] Brochure download failed:', pdfErr);
    });

    // Instant UI transition - zero latency for user
    setDone(true);
    setIsSubmitting(false);

    // Background delivery of inquiry & email notification
    dispatchInquiryInBackground(
      {
        name: name.trim(),
        email: email.trim(),
        mobile: phone,
        subject: `Course Brochure Download: ${courseName}`,
        message: [
          'Course Brochure Request',
          `Course: ${courseName}`,
          `Address: ${address.trim()}`,
          `Brochure: FGIIT Job-Ready Batch course brochure (PDF) sent to the candidate.`,
        ].join('\n'),
        source: window.location.href,
        details: {
          leadType: 'course_brochure_download',
          course: courseName,
          courseId: course,
          address: address.trim(),
          brochureFileName: 'FGIIT_Job_Ready_Batch_Course_Brochure.pdf',
        },
      },
      {
        telemetry: {
          type: 'brochure_lead',
          data: {
            course: courseName,
            name: name.trim(),
            phone,
            email: email.trim(),
            address: address.trim(),
          },
        },
      }
    );
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4A630B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="eyebrow" style={{ color: 'var(--deep)' }}>BROCHURE ON ITS WAY</span>
          <h3 style={{ margin: 0, fontSize: '21px' }}>Thanks, {name.trim()} — your brochure is downloading</h3>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)' }}>
            We have sent the complete course brochure to your email as well, and our team will
            contact you on WhatsApp within 24 hours about {courseName}.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              className="btn btn-lime"
              href={brochureHref}
              download={brochureFile}
              target="_blank"
              rel="noopener noreferrer"
              style={{ minHeight: '48px' }}
            >
              Download the brochure again
            </a>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="eyebrow">DOWNLOAD THE COMPLETE COURSE BROCHURE</span>
          <h3 style={{ margin: 0, fontSize: '21px', paddingRight: '40px' }}>
            Tell us where to send it
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
            The brochure lists every course with its duration, fee and full syllabus. It downloads
            straight to your device, and we also email it to you.
          </p>

          <div className="fgrid">
            <label className="field">
              Full name
              <input
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={handleNameChange}
              />
            </label>
            <label className="field">
              Contact number
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
                onChange={handleEmailChange}
              />
            </label>
            <label className="field">
              Address
              <input
                type="text"
                autoComplete="street-address"
                placeholder="City, State"
                value={address}
                onChange={handleAddressChange}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="lbl">Course you are interested in</span>
            <div className="chips">
              {options.map((opt) => {
                const active = course === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`chip${active ? ' on' : ''}`}
                    aria-pressed={active}
                    onClick={() => {
                      setCourse(opt.id);
                      if (err) setErr('');
                    }}
                  >
                    {opt.name}
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
            className="btn btn-lime"
            disabled={isSubmitting}
            style={{ alignSelf: 'flex-start', minHeight: '50px' }}
          >
            {isSubmitting ? 'Preparing your brochure...' : 'Download the Course Brochure'}
          </button>
        </form>
      )}
    </div>
  );
}
