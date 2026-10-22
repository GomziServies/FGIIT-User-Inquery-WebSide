import React, { useState } from 'react';
import {
  CATS,
  QUESTIONS,
  calculateScore,
  okPhone,
  okEmail,
  uploadInquiryFile,
  dispatchInquiryInBackground,
} from '../data/fgiitData';

export default function CoachLevelQuiz({ onOpenReport }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [err, setErr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const N = QUESTIONS.length;

  const handleSelectOption = (optIdx) => {
    const updated = [...answers];
    updated[step] = optIdx;
    setAnswers(updated);
    setErr('');
  };

  const handleNext = () => {
    if (answers[step] === undefined) {
      setErr('Please choose an answer to continue.');
      return;
    }
    setErr('');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErr('');
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers([]);
    setName('');
    setPhone('');
    setEmail('');
    setStatus('');
    setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    if (err) setErr('');
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErr('Please enter your name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (email.trim() && !okEmail(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!status) {
      setErr('Please tell us what you do currently.');
      return;
    }

    setErr('');
    setIsSubmitting(false);

    // 1. Calculate score & report data
    const report = calculateScore(answers);
    const candidateData = {
      name: name.trim() || 'Candidate',
      email: email.trim(),
      phone,
      status,
    };
    const cleanFilename = `FGIIT_Coach_Level_Report_${(name.trim() || 'Candidate').replace(/\s+/g, '_')}_${phone}.pdf`;

    // 2. INSTANT UI TRANSITION: Transition to report view with zero latency
    setStep(N + 1);
    onOpenReport({
      ...report,
      userName: name.trim(),
      email: email.trim(),
      phone,
      status,
      fileUrl: '',
      inquirySaved: true,
    });

    // 3. BACKGROUND DISPATCH: PDF generation, S3 upload, email delivery & telemetry
    (async () => {
      let uploadedFileUrl = '';
      try {
        const { generateCoachReportPDF } = await import('../utils/pdfGenerator');
        const pdfDoc = generateCoachReportPDF(report, candidateData);

        // Auto download official PDF report to candidate
        try {
          pdfDoc.save(cleanFilename);
        } catch (saveErr) {
          console.warn('[FGIIT] Auto PDF download error:', saveErr);
        }

        // Upload PDF blob to fg-api backend for storage in AWS S3 and direct preview in admin panel
        try {
          const pdfBlob = pdfDoc.output('blob');
          const uploadRes = await uploadInquiryFile(pdfBlob, cleanFilename);
          if (uploadRes?.success && uploadRes?.url) {
            uploadedFileUrl = uploadRes.url;
            // Update report view with the permanent S3 file URL if modal is still open
            onOpenReport({
              ...report,
              userName: name.trim(),
              email: email.trim(),
              phone,
              status,
              fileUrl: uploadedFileUrl,
              inquirySaved: true,
            });
          }
        } catch (uploadErr) {
          console.warn('[FGIIT] PDF upload to backend error:', uploadErr);
        }
      } catch (pdfGenErr) {
        console.warn('[FGIIT] Background PDF generation error:', pdfGenErr);
      }

      // Format rich message for the FGIIT Contact Inquiries admin panel and email
      const reportLinkLine = uploadedFileUrl
        ? `Assessment Report (PDF): ${uploadedFileUrl}`
        : 'Assessment Report (PDF): downloaded to your device after submission.';

      const formattedMessage = [
        `Coach Level Test Assessment`,
        `Score: ${report.score}/${N} (${report.level[0]})`,
        `Current Status: ${status}`,
        `Lowest Scoring Focus Areas: ${report.weak.map((w) => w.n).join(', ')}`,
        ``,
        `Domain Breakdown:`,
        ...report.cats.map((c) => `- ${c.n}: ${c.got}/${c.total} (${c.p}%)`),
        ``,
        reportLinkLine,
      ].join('\n');

      // Dispatch inquiry & confirmation email in background via persistent queue
      dispatchInquiryInBackground(
        {
          name: name.trim(),
          email: email.trim(),
          mobile: phone,
          subject: 'Coach Level Test Assessment:',
          message: formattedMessage,
          source: window.location.href,
          file: uploadedFileUrl || undefined,
          files: uploadedFileUrl
            ? [{ url: uploadedFileUrl, remark: 'Coach Level Test Assessment Report (PDF)' }]
            : undefined,
          details: {
            score: `${report.score}/${N}`,
            level: report.level[0],
            levelDesc: report.level[1],
            status,
            weakAreas: report.weak.map((w) => w.n).join(', '),
            sectionScores: report.cats.map((c) => `${c.n} ${c.got}/${c.total}`).join('; '),
            categories: report.cats,
            reportUrl: uploadedFileUrl,
            reportFileName: cleanFilename,
          },
        },
        {
          telemetry: {
            type: 'quiz_lead',
            data: {
              name: name.trim(),
              phone,
              email: email.trim(),
              status,
              score: `${report.score}/${N}`,
              level: report.level[0],
              file: uploadedFileUrl,
              weakAreas: report.weak.map((w) => w.n).join(', '),
              sectionScores: report.cats.map((c) => `${c.n} ${c.got}/${c.total}`).join('; '),
            },
          },
        }
      );
    })();
  };

  const currentResult = step > N ? calculateScore(answers) : null;

  return (
    <section id="test" style={{ background: 'var(--bg2)' }}>
      <div
        className="wrap"
        style={{
          paddingTop: '52px',
          paddingBottom: '52px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Test Intro and Category Chips */}
        <div
          style={{
            flex: '1 1 300px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <span className="eyebrow">FREE · 15 QUESTIONS · 4 MINUTES</span>
          <h2 className="h2">What Level of Fitness Trainer Are You?</h2>
          <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.65, color: 'var(--muted)' }}>
            Take our free assessment to discover your current trainer level and identify
            opportunities to improve your knowledge and skills.
          </p>
          <button
            type="button"
            className="btn btn-lime"
            onClick={() => {
              const quiz = document.getElementById('quiz');
              if (quiz) {
                quiz.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const first = quiz.querySelector('.opt');
                if (first) first.focus({ preventScroll: true });
              }
            }}
            style={{ alignSelf: 'flex-start', minHeight: '48px' }}
          >
            Take the Free Assessment
          </button>
          <div className="chips" id="catList">
            {CATS.map((cat, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  color: 'var(--text2)',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Quiz Box */}
        <div
          id="quiz"
          aria-live="polite"
          style={{
            flex: '999 1 520px',
            minWidth: 0,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: '24px',
            padding: 'clamp(20px, 4vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 4px 20px rgba(11, 18, 16, 0.04)',
          }}
        >
          {step < N ? (
            /* Question Phase */
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'var(--muted)',
                  }}
                >
                  <span>
                    Question {step + 1} of {N} · {CATS[QUESTIONS[step].cat]}
                  </span>
                  <span>{Math.round((step / N) * 100)}%</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: '#E8EEEB',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round((step / N) * 100)}%`,
                      background: 'var(--lime)',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
              </div>

              <h3 style={{ margin: 0, fontSize: '19px', lineHeight: 1.4 }}>
                {QUESTIONS[step].text}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {QUESTIONS[step].opts.map((opt, i) => {
                  const isSelected = answers[step] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`opt${isSelected ? ' on' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(i)}
                    >
                      <span className="k">{'ABCD'[i]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {err && (
                <div className="err" role="alert">
                  {err}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  borderTop: '1px solid #EEF2F0',
                  paddingTop: '18px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleBack}
                  disabled={step === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={handleNext}
                  style={{ minWidth: '140px' }}
                >
                  {step === N - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </>
          ) : step === N ? (
            /* Lead Capture Phase */
            <form onSubmit={handleSubmitLead} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px' }}>
                  All {N} answered. Where should we send your report?
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '15px', color: 'var(--muted)' }}>
                  See it right here, and get a copy on WhatsApp with your improvement plan.
                </p>
              </div>

              <div className="fgrid">
                <label className="field">
                  Full name *
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (err) setErr('');
                    }}
                  />
                </label>
                <label className="field">
                  WhatsApp number *
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
                    placeholder="you@example.com (optional)"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (err) setErr('');
                    }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="lbl">You are currently *</span>
                <div className="chips">
                  {['Student', 'Working trainer', 'Gym owner', 'Career switcher'].map((s) => {
                    const active = status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setStatus(s);
                          if (err) setErr('');
                        }}
                      >
                        {s}
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

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  borderTop: '1px solid #EEF2F0',
                  paddingTop: '18px',
                }}
              >
                <button type="button" className="btn btn-ghost" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </button>
                <button type="submit" className="btn btn-lime" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'See my report'}
                </button>
              </div>
            </form>
          ) : (
            /* Completed Result Phase */
            currentResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span className="eyebrow">YOUR RESULT</span>
                <h3 style={{ margin: 0, fontSize: '24px' }}>
                  {currentResult.score}/{N} · {currentResult.level[0]}
                </h3>
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--muted)' }}>
                  {currentResult.level[1]}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-green"
                    onClick={() =>
                    onOpenReport({
                      ...currentResult,
                      userName: name.trim(),
                      email: email.trim(),
                      phone,
                      status,
                    })
                    }
                  >
                    View my report
                  </button>
                  <button
                    type="button"
                    className="btn btn-lime"
                    onClick={() =>
                      downloadCoachReportPDF(currentResult, {
                        name: name.trim() || 'Candidate',
                        email: email.trim(),
                        phone,
                        status,
                      })
                    }
                  >
                    Download PDF Report
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={handleRetake}>
                    Retake test
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
