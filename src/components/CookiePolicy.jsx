import React from 'react';

export default function CookiePolicy({ onNavigate }) {
  return (
    <section style={{ padding: '60px 0 40px', background: 'var(--bg)' }}>
      <div className="wrap" style={{ maxWidth: '800px' }}>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            background: 'none', border: 0, cursor: 'pointer', font: 'inherit',
            color: 'var(--accent)', fontWeight: 600, fontSize: '14px', marginBottom: '24px',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          ← Back to home
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
          Cookie &amp; Data Collection Policy
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '32px' }}>
          FGIIT Job-Ready Batch Landing Page &mdash; Last updated: October 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '15px', lineHeight: 1.7, color: 'var(--ink)' }}>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>What this page does</h2>
            <p>
              This landing page uses a lightweight visitor tracker to understand how visitors interact with
              the page and, when a visitor submits a form, to create a lead in our CRM (Customer Relationship
              Management) system. The tracker is loaded from our API server and uses browser storage to
              maintain session state.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Before you agree (anonymous)</h2>
            <p style={{ marginBottom: '12px' }}>
              When you visit this page without agreeing to the cookie policy and without submitting any
              form, the tracker records only anonymous, non-identifying activity:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Pages viewed and buttons clicked</li>
              <li>Referring website (e.g. Google, Facebook)</li>
              <li>UTM campaign parameters from the URL</li>
              <li>Device type (mobile / desktop)</li>
              <li>Timestamp of the visit</li>
            </ul>
            <p style={{ marginTop: '12px', fontWeight: 600 }}>
              No name, phone number, email address, IP address, or persistent identifier is collected
              or sent before you agree.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>After you accept the cookie policy (with consent)</h2>
            <p style={{ marginBottom: '12px' }}>
              Clicking <strong>&ldquo;Accept All&rdquo;</strong> on the cookie banner acts as your agreement.
              Our tracker then:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Creates a visitor identifier in this browser's own cookie and localStorage, so your visits can be recognised as one visitor</li>
              <li>Pages viewed, sections seen and buttons clicked (this and future visits)</li>
              <li>Your device details the browser exposes to any site (device type, OS, browser, screen size, language, timezone)</li>
              <li>
                A summary of the browser storage <strong>this site keeps in your browser</strong>:
                localStorage, sessionStorage, cookies, IndexedDB (database / store names and record
                counts) and service-worker cache names. Sensitive entries (tokens, passwords, payment
                fields) are excluded, and data of other websites cannot be read.
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              This visit summary is saved in our CRM (marketing panel) as a <em>Website Visitor</em>-platform
              lead without contact details. If the FGIIT Academy app previously saved your profile in this
              browser, that profile may be included in the same lead.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>After you submit a form (with agreement)</h2>
            <p style={{ marginBottom: '12px' }}>
              Submitting any form on this page (enquiry, demo request, assessment, etc.) also acts as your
              agreement — a notice is displayed above every submit button. The form's contact details are
              added to the same lead, which then also carries:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Name, phone number, email address (as entered in the form)</li>
              <li>Your saved FGIIT profile from browser storage (if the FGIIT Academy app previously saved one)</li>
              <li>All page activity from this and future sessions (pages, clicks, courses viewed)</li>
              <li>Interest score calculated from your visit activity</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Browser storage used</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg2)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', borderBottom: '2px solid var(--line)', fontWeight: 700 }}>Storage key</th>
                    <th style={{ padding: '10px 12px', borderBottom: '2px solid var(--line)', fontWeight: 700 }}>Type</th>
                    <th style={{ padding: '10px 12px', borderBottom: '2px solid var(--line)', fontWeight: 700 }}>Created when</th>
                    <th style={{ padding: '10px 12px', borderBottom: '2px solid var(--line)', fontWeight: 700 }}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_sid</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>sessionStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Page load</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Random session ID to group page views in one visit</td>
                  </tr>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_anon_events</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>sessionStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Page load</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Anonymous page views and clicks (no identity)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_events</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>sessionStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>After you agree</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Page activity linked to your visit or contact details</td>
                  </tr>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_cookie_choice</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>localStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Cookie banner answer</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Remembers whether you accepted or rejected the cookie policy</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_lead_consent</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>localStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>After you accept the cookie policy or submit a form</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Records that you agreed to the visit tracking</td>
                  </tr>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_consent_source</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>localStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>After you accept the cookie policy or submit a form</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Where the agreement came from (banner or form)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fg_vid</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>localStorage + cookie</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>After you accept the cookie policy or submit a form</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Visitor identifier for recognizing return visits (deleted when you reject the banner or stop tracking)</td>
                  </tr>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}><code>fgiit_user_profile_v1</code></td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>localStorage</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>By FGIIT Academy app</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Your saved profile (name, phone, email) — read <strong>only after</strong> form agreement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Third-party cookies</h2>
            <p>
              This page does not set any third-party tracking cookies. The Razorpay checkout script is
              loaded for payment processing and may set its own cookies when a payment is initiated.
              Google Fonts are loaded for typography; Google may set cookies through their CDN.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>How to opt out</h2>
            <p>
              You can withdraw your agreement at any time. Click <strong>&ldquo;Reject All&rdquo;</strong> on
              the cookie banner (re-open it by clearing <code>fg_cookie_choice</code> from this site's
              localStorage), or use <strong>&ldquo;Stop tracking on this device&rdquo;</strong> in the
              footer below. Both remove your visitor identifier and stop the tracker from sending any
              further contact details or visit activity from this browser.
              You can also clear your browser's localStorage and sessionStorage for this site.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Data retention</h2>
            <p>
              Anonymous visit events are automatically deleted after 90 days. Identified visitor records
              and leads are retained in the CRM for business follow-up purposes. sessionStorage data is
              cleared automatically when you close the browser tab.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Contact</h2>
            <p>
              For questions about data collection on this page, contact FG Group at{' '}
              <a href="https://fggroup.in/contact" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                fggroup.in/contact
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
