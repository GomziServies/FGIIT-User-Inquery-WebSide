import React from 'react';

/**
 * Shown above the submit button of every form. Sending the form is the visitor's agreement: the visitor
 * tracker (fg-api /public/v1/visitor/tracker.js) starts sharing their details and visit activity with the
 * CRM only when submitContactInquiry() runs.
 */
export default function SubmitNotice() {
  return (
    <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.55, color: 'var(--muted)' }}>
      By sending this form you agree that FGIIT saves your details and your activity on this site (pages
      viewed, courses, how you found us) so our admissions team can follow up. You can stop this anytime
      with &ldquo;Stop tracking on this device&rdquo; in the footer.
    </p>
  );
}
