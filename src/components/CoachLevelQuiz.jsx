import React, { useState } from 'react';
import Icon from './Icons';
import SubmitNotice from './SubmitNotice';
import {
  CATS,
  QUESTIONS,
  calculateScore,
  okPhone,
  okEmail,
  uploadInquiryFile,
  dispatchInquiryInBackground,
  saveUserProfile,
  getUserProfile,
} from '../data/fgiitData';

export default function CoachLevelQuiz({ onOpenReport, onNavigate }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState(() => getUserProfile()?.name || '');
  const [phone, setPhone] = useState(() => getUserProfile()?.phone || '');
  const [email, setEmail] = useState(() => getUserProfile()?.email || '');
  const [status, setStatus] = useState(() => getUserProfile()?.status || '');
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

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveUserProfile({ name: val });
    if (err) setErr('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 15);
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

  const handleStatusChange = (val) => {
    setStatus(val);
    saveUserProfile({ status: val });
    if (err) setErr('');
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErr('Please enter your name.');
      return;
    }
    if (!okPhone(phone)) {
      setErr('Please enter a valid WhatsApp number (10 digits, or with country code).');
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

    // Save profile for auto-fill in Course Buy / Demo / Brochure modals
    saveUserProfile({
      name: name.trim(),
      phone,
      email: email.trim(),
      status,
    });

    // 1. Calculate score & report data
    const report = calculateScore(answers);
    const candidateData = {
      name: name.trim() || 'Candidate',
      email: email.trim(),
      phone,
      status,
    };
    const cleanFilename = `FGIIT_Coach_Level_Report_${(name.trim() || 'Candidate').replace(/\s+/g, '_')}_${phone}.pdf`;

    // 2. IMMEDIATE REDIRECTION: Seamlessly navigate to Courses section (#courses)
    if (onNavigate) {
      onNavigate('home', 'courses');
    } else {
      window.location.href = '/#courses';
    }

    // 3. BACKGROUND DISPATCH: PDF generation, auto-download, S3 upload & lead capture
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

  const currentResult = step >= N ? calculateScore(answers) : null;

  const handleDownloadPDF = async () => {
    try {
      const { downloadCoachReportPDF } = await import('../utils/pdfGenerator');
      downloadCoachReportPDF(currentResult, {
        name: name.trim() || 'Candidate',
        email: email.trim(),
        phone,
        status,
      });
    } catch (err) {
      console.warn('[FGIIT] PDF download error:', err);
    }
  };

  return (
    <section
      id="test"
      style={{
        background:
          'radial-gradient(ellipse at 12% 15%, rgba(155, 192, 40, 0.08) 0%, transparent 45%), radial-gradient(ellipse at 88% 85%, rgba(74, 99, 11, 0.06) 0%, transparent 45%), #F8FAF9',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="wrap"
        style={{
          paddingTop: 'clamp(44px, 5vw, 68px)',
          paddingBottom: 'clamp(48px, 5.5vw, 76px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(28px, 4vw, 48px)',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Test Intro, Live Category Sync and Trust Badges */}
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Eyebrow with pulsating indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '1px solid #D8E4DB',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: 'var(--deep)',
              alignSelf: 'flex-start',
              boxShadow: '0 2px 6px rgba(11, 18, 16, 0.03)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--lime)',
                boxShadow: '0 0 8px rgba(155, 192, 40, 0.8)',
                display: 'inline-block',
              }}
            />
            FREE · 15 QUESTIONS · 4 MINUTES
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 3.2vw, 38px)',
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--ink)',
            }}
          >
            What Level of Fitness Trainer Are You?
          </h2>

          <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.65, color: 'var(--muted)' }}>
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
            style={{
              alignSelf: 'flex-start',
              minHeight: '50px',
              padding: '0 24px',
              fontSize: '15px',
              boxShadow: '0 8px 24px -4px rgba(155, 192, 40, 0.42)',
            }}
          >
            Take the Free Assessment ↓
          </button>

          {/* Category Chips with Live Active Highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Evaluation Domains:
            </span>
            <div className="chips" id="catList">
              {CATS.map((cat, idx) => {
                const isCurrentCat = step < N && QUESTIONS[step]?.cat === idx;
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12.5px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: isCurrentCat ? 'var(--tint)' : '#FFFFFF',
                      border: '1.5px solid',
                      borderColor: isCurrentCat ? 'var(--deep)' : 'var(--line)',
                      color: isCurrentCat ? 'var(--deep)' : 'var(--text2)',
                      fontWeight: isCurrentCat ? 800 : 500,
                      boxShadow: isCurrentCat
                        ? '0 2px 10px rgba(74, 99, 11, 0.15)'
                        : '0 1px 3px rgba(11, 18, 16, 0.02)',
                      transition: 'all 0.25s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isCurrentCat && (
                      <span style={{ color: 'var(--lime)', fontWeight: 800, lineHeight: 1 }}>•</span>
                    )}
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Trust & Benchmark Social Proof Card / Dynamic Live Score */}
          {currentResult && step === N ? (
            <div
              style={{
                background: 'linear-gradient(135deg, #F4F9E6 0%, #FFFFFF 100%)',
                border: '1.5px solid var(--lime)',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 4px 14px rgba(155, 192, 40, 0.15)',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--tint)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--deep)',
                  flexShrink: 0,
                }}
              >
                <Icon name="trophy" size={22} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--deep)' }}>
                  Your Score: {currentResult.score}/{N} ({Math.round((currentResult.score / N) * 100)}%)
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 600 }}>
                  Benchmarked Level: {currentResult.level[0]}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E1ECE6',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 4px 14px rgba(11, 18, 16, 0.03)',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--tint)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--deep)',
                  flexShrink: 0,
                }}
              >
                <Icon name="target" size={22} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                  25,000+ Coaches Benchmarked
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Instant score report card with PDF download
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quiz Box (Refined Card Architecture) */}
        <div
          id="quiz"
          aria-live="polite"
          style={{
            flex: '999 1 540px',
            minWidth: 0,
            background: '#FFFFFF',
            border: '1.5px solid #E2EDE7',
            borderRadius: '26px',
            padding: 'clamp(22px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            boxShadow: '0 20px 52px -12px rgba(11, 18, 16, 0.07), 0 2px 8px rgba(11, 18, 16, 0.03)',
          }}
        >
          {step < N ? (
            /* Question Phase */
            <>
              {/* Progress & Category Top Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        background: 'var(--tint)',
                        color: 'var(--deep)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #DCE6D2',
                      }}
                    >
                      {CATS[QUESTIONS[step].cat]}
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                      Question {step + 1}{' '}
                      <span style={{ color: 'var(--muted)', fontWeight: 500 }}>of {N}</span>
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: 'var(--deep)',
                      background: '#F1F7EE',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: '1px solid #DCE6D2',
                    }}
                  >
                    {Math.round((step / N) * 100)}% Answered
                  </span>
                </div>

                <div
                  style={{
                    height: '8px',
                    background: '#EDF3F0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round((step / N) * 100)}%`,
                      background: 'linear-gradient(90deg, #9BC028 0%, #B4DC2E 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 0 8px rgba(155, 192, 40, 0.5)',
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h3
                style={{
                  margin: 0,
                  fontSize: 'clamp(18px, 2.2vw, 22px)',
                  lineHeight: 1.38,
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)',
                  letterSpacing: '-0.015em',
                }}
              >
                {QUESTIONS[step].text}
              </h3>

              {/* Options Stack */}
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
                      <span style={{ flex: '1 1 auto' }}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {err && (
                <div className="err" role="alert" style={{ borderRadius: '12px', padding: '10px 14px' }}>
                  {err}
                </div>
              )}

              {/* Navigation CTAs */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid #EEF3F0',
                  paddingTop: '20px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleBack}
                  disabled={step === 0}
                  style={{ minHeight: '48px', padding: '0 20px' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-lime"
                  onClick={handleNext}
                  style={{
                    minWidth: '150px',
                    minHeight: '48px',
                    padding: '0 24px',
                    fontWeight: 800,
                  }}
                >
                  {step === N - 1 ? 'Finish Assessment →' : 'Next Question →'}
                </button>
              </div>
            </>
          ) : step === N ? (
            /* Lead Capture Phase */
            <form onSubmit={handleSubmitLead} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Official Diagnostic Score Banner */}
              {currentResult && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #F4F9E6 0%, #FFFFFF 100%)',
                    border: '2px solid var(--lime)',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 8px 24px -4px rgba(155, 192, 40, 0.22)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Round Score Dial / Circular Badge - Perfectly Centered */}
                      <div
                        style={{
                          position: 'relative',
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          width="74"
                          height="74"
                          viewBox="0 0 74 74"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            transform: 'rotate(-90deg)',
                          }}
                          aria-hidden="true"
                        >
                          <circle
                            cx="37"
                            cy="37"
                            r="32"
                            fill="none"
                            stroke="#DDE8C4"
                            strokeWidth="4.5"
                          />
                          <circle
                            cx="37"
                            cy="37"
                            r="32"
                            fill="none"
                            stroke="var(--lime)"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            strokeDasharray={`${((currentResult.score / N) * 201.06).toFixed(1)} 201.06`}
                          />
                        </svg>
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '50%',
                            background: 'var(--deep)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(74, 99, 11, 0.28)',
                            zIndex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'baseline',
                              justifyContent: 'center',
                              gap: '1.5px',
                              transform: 'translateY(-1px)',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '22px',
                                fontWeight: 900,
                                lineHeight: 1,
                                color: '#FFFFFF',
                              }}
                            >
                              {currentResult.score}
                            </span>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: 'var(--lime)',
                              }}
                            >
                              /{N}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 800,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: 'var(--deep)',
                            }}
                          >
                            Your Assessment Score
                          </span>
                          <span
                            style={{
                              background: 'var(--lime)',
                              color: 'var(--ink)',
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {Math.round((currentResult.score / N) * 100)}%
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: 'var(--ink)',
                            fontFamily: 'var(--font-heading)',
                            marginTop: '3px',
                            lineHeight: 1.2,
                          }}
                        >
                          {currentResult.level[0]}
                        </div>
                      </div>
                    </div>

                    {onOpenReport && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenReport({
                            ...currentResult,
                            userName: name.trim() || 'Candidate',
                            email: email.trim(),
                            phone,
                            status: status || 'Candidate',
                          })
                        }
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid var(--lime)',
                          borderRadius: '999px',
                          padding: '7px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--deep)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--tint)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                      >
                        <Icon name="chart" size={16} style={{ color: 'var(--deep)' }} />
                        <span>View Detailed Breakdown</span>
                      </button>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)', lineHeight: 1.55 }}>
                    {currentResult.level[1]}
                  </p>

                  {/* Domain Breakdown Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '2px' }}>
                    {currentResult.cats.map((cat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          padding: '4px 9px',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E1ECE6',
                          color: 'var(--text2)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: cat.color,
                          }}
                        />
                        {cat.n}: <b style={{ color: 'var(--ink)' }}>{cat.got}/{cat.total}</b>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--tint)',
                    color: 'var(--deep)',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  <Icon name="checkCircle" size={14} style={{ color: 'var(--deep)' }} />
                  <span>All 15 Questions Answered</span>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'clamp(20px, 2.4vw, 25px)',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    lineHeight: 1.25,
                  }}
                >
                  Where should we send your official diagnostic report?
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
                  View your competency score breakdown on-screen, plus receive an instant official PDF report and
                  improvement plan on WhatsApp.
                </p>
              </div>

              <div className="fgrid">
                <label className="field">
                  Full name *
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={handleNameChange}
                    style={{ borderRadius: '12px' }}
                  />
                </label>
                <label className="field">
                  WhatsApp number *
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="Mobile number (country code optional)"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{ borderRadius: '12px' }}
                  />
                </label>
                <label className="field">
                  Email ID
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com (optional)"
                    value={email}
                    onChange={handleEmailChange}
                    style={{ borderRadius: '12px' }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="lbl" style={{ fontWeight: 700, fontSize: '13.5px' }}>
                  You are currently *
                </span>
                <div className="chips">
                  {['Student', 'Working trainer', 'Gym owner', 'Career switcher'].map((s) => {
                    const active = status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        className={`chip${active ? ' on' : ''}`}
                        aria-pressed={active}
                        onClick={() => handleStatusChange(s)}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {err && (
                <div className="err" role="alert" style={{ borderRadius: '12px', padding: '10px 14px' }}>
                  {err}
                </div>
              )}

              {/* Privacy Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--muted)',
                }}
              >
                <Icon name="lock" size={15} style={{ color: 'var(--deep)', flexShrink: 0 }} />
                <span>Your contact details are strictly confidential. No spam guaranteed.</span>
              </div>

              <SubmitNotice />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid #EEF3F0',
                  paddingTop: '20px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  style={{ minHeight: '48px', padding: '0 20px' }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-lime"
                  disabled={isSubmitting}
                  style={{ minHeight: '52px', padding: '0 28px', fontWeight: 800 }}
                >
                  {isSubmitting ? 'Redirecting to Courses...' : 'Explore Our Courses →'}
                </button>
              </div>
            </form>
          ) : (
            /* Completed Result Phase */
            currentResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span className="eyebrow">YOUR OFFICIAL BENCHMARK RESULT</span>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #F4F9E6 0%, #FFFFFF 100%)',
                    border: '1.5px solid var(--lime)',
                    borderRadius: '20px',
                    padding: '22px 26px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    boxShadow: '0 4px 18px rgba(155, 192, 40, 0.15)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '34px',
                        fontWeight: 800,
                        color: 'var(--deep)',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1,
                      }}
                    >
                      {currentResult.score}{' '}
                      <span style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: 500 }}>
                        / {N}
                      </span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginTop: '4px' }}>
                      {currentResult.level[0]}
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'var(--lime)',
                      color: 'var(--ink)',
                      fontWeight: 800,
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      boxShadow: '0 2px 8px rgba(155, 192, 40, 0.35)',
                    }}
                  >
                    {Math.round((currentResult.score / N) * 100)}% Score
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '15.5px', color: 'var(--text2)', lineHeight: 1.6 }}>
                  {currentResult.level[1]}
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-lime"
                    onClick={() =>
                      onOpenReport({
                        ...currentResult,
                        userName: name.trim(),
                        email: email.trim(),
                        phone,
                        status,
                      })
                    }
                    style={{ minHeight: '52px', padding: '0 26px', fontWeight: 800 }}
                  >
                    View Full Score Report
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleDownloadPDF}
                    style={{
                      minHeight: '52px',
                      padding: '0 22px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon name="download" size={16} />
                    <span>Download PDF Report</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleRetake}
                    style={{
                      minHeight: '52px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon name="refresh" size={16} />
                    <span>Retake Test</span>
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
