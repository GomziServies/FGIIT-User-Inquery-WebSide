import { jsPDF } from 'jspdf';

/**
 * Generates an official, high-resolution FGIIT Coach Level Diagnostic Assessment Report in PDF format.
 *
 * @param {Object} report - Result object from calculateScore(answers)
 * @param {number} report.score - Number of correct answers (0-15)
 * @param {number} report.totalQuestions - Total questions (15)
 * @param {Array} report.level - [Title, Description] e.g. ['Elite Coach', '...']
 * @param {Array} report.cats - Array of 7 category score objects { n, got, total, p, color }
 * @param {Array} report.weak - Lowest 2 scoring categories
 * @param {Object} candidate - Student / lead metadata
 * @param {string} candidate.name - Candidate full name
 * @param {string} candidate.phone - 10-digit WhatsApp mobile number
 * @param {string} [candidate.email] - Candidate email
 * @param {string} [candidate.status] - Candidate current status (e.g. 'Working trainer')
 * @returns {jsPDF} The generated jsPDF document instance
 */
export function generateCoachReportPDF(report, candidate = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const deepGreen = [74, 99, 11];     // #4A630B
  const limeGreen = [155, 192, 40];   // #9BC028
  const tintBg = [244, 249, 230];     // #F4F9E6
  const darkInk = [11, 18, 16];       // #0B1210
  const mutedText = [85, 100, 95];    // #55645F
  const lightLine = [225, 232, 229];  // #E1E8E5
  const white = [255, 255, 255];

  let y = margin;

  // Top Accent Bar
  doc.setFillColor(...deepGreen);
  doc.rect(0, 0, pageWidth, 5, 'F');
  y += 2;

  // 1. HEADER SECTION
  doc.setFillColor(...tintBg);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // Institution title
  doc.setTextColor(...deepGreen);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FGIIT · FITNESS WITH GOMZI INTERNATIONAL INSTITUTE OF TEACHING', margin + 6, y + 8);

  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'INPTA Accredited · IPTNA Member · ISO 9001:2015 Certified · Central Govt Recognized Skill Partner',
    margin + 6,
    y + 14
  );
  doc.text(
    'Head Office: 2, GOMZI Abhushan, Char Rasta, Katargam, Surat, Gujarat 395008 | Phone: +91 63540 51487',
    margin + 6,
    y + 19
  );

  y += 28;

  // Report Title & Meta
  doc.setTextColor(...darkInk);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COACH LEVEL DIAGNOSTIC ASSESSMENT REPORT', margin, y + 4);

  const reportId = `FGIIT-CLR-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(`Report ID: ${reportId}  |  Assessment Date: ${dateStr}`, margin, y + 10);

  y += 15;

  // 2. CANDIDATE PROFILE CARD
  doc.setDrawColor(...lightLine);
  doc.setFillColor(...white);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...deepGreen);
  doc.text('CANDIDATE INFORMATION', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkInk);

  const candName = candidate.name ? candidate.name.trim() : 'Candidate';
  const candPhone = candidate.phone ? candidate.phone.trim() : 'N/A';
  const candEmail = candidate.email ? candidate.email.trim() : `${candPhone}@fgiit.in`;
  const candStatus = candidate.status ? candidate.status.trim() : 'Fitness Coach';

  doc.text(`Name: ${candName}`, margin + 5, y + 12);
  doc.text(`Mobile: ${candPhone}`, margin + 60, y + 12);
  doc.text(`Status: ${candStatus}`, margin + 120, y + 12);
  doc.text(`Email: ${candEmail}`, margin + 5, y + 17);

  y += 24;

  // 3. OVERALL SCORE & LEVEL BADGE
  const score = report.score || 0;
  const total = report.totalQuestions || 15;
  const percentage = Math.round((score / total) * 100);
  const levelTitle = (report.level && report.level[0]) || 'Coach';
  const levelDesc = (report.level && report.level[1]) || '';

  doc.setFillColor(...tintBg);
  doc.setDrawColor(...limeGreen);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'FD');

  // Score badge box
  doc.setFillColor(...deepGreen);
  doc.roundedRect(margin + 5, y + 4, 34, 22, 2, 2, 'F');
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${score}/${total}`, margin + 22, y + 13, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`${percentage}% Score`, margin + 22, y + 20, { align: 'center' });

  // Level classification text
  doc.setTextColor(...deepGreen);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('OVERALL BENCHMARK RATING', margin + 44, y + 9);

  doc.setTextColor(...darkInk);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(levelTitle.toUpperCase(), margin + 44, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(levelDesc, margin + 44, y + 23);

  y += 35;

  // 4. SECTION-WISE BREAKDOWN TABLE
  doc.setTextColor(...darkInk);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SECTION-WISE COMPETENCY MATRIX (7 CORE DOMAINS)', margin, y + 4);
  y += 7;

  // Table header
  doc.setFillColor(...deepGreen);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Core Knowledge Domain', margin + 4, y + 4.8);
  doc.text('Questions', margin + 78, y + 4.8);
  doc.text('Proficiency', margin + 104, y + 4.8);
  doc.text('Competency Level', margin + 140, y + 4.8);

  y += 7;

  // Rows
  const cats = report.cats || [];
  cats.forEach((cat, idx) => {
    const rowY = y + idx * 8;
    const isEven = idx % 2 === 0;

    doc.setFillColor(isEven ? 250 : 255, isEven ? 250 : 255, isEven ? 250 : 255);
    doc.rect(margin, rowY, contentWidth, 8, 'F');
    doc.setDrawColor(...lightLine);
    doc.setLineWidth(0.2);
    doc.line(margin, rowY + 8, margin + contentWidth, rowY + 8);

    doc.setTextColor(...darkInk);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${idx + 1}. ${cat.n}`, margin + 4, rowY + 5.2);

    doc.text(`${cat.got} / ${cat.total}`, margin + 82, rowY + 5.2);

    // Mini progress bar in table
    const barWidth = 26;
    doc.setFillColor(230, 235, 233);
    doc.roundedRect(margin + 104, rowY + 2.5, barWidth, 3, 1, 1, 'F');

    const fillWidth = (cat.p / 100) * barWidth;
    if (cat.p >= 70) doc.setFillColor(...deepGreen);
    else if (cat.p >= 40) doc.setFillColor(217, 119, 6);
    else doc.setFillColor(185, 28, 28);

    if (fillWidth > 0) {
      doc.roundedRect(margin + 104, rowY + 2.5, fillWidth, 3, 1, 1, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const statusText = cat.p >= 70 ? 'Proficient' : cat.p >= 40 ? 'Needs Practice' : 'Action Required';
    if (cat.p >= 70) doc.setTextColor(...deepGreen);
    else if (cat.p >= 40) doc.setTextColor(180, 83, 9);
    else doc.setTextColor(185, 28, 28);

    doc.text(`${cat.p}% (${statusText})`, margin + 140, rowY + 5.2);
  });

  y += cats.length * 8 + 6;

  // 5. DIAGNOSTIC PRESCRIPTION & WEAK AREAS
  const weakNames = report.weak && report.weak.length ? report.weak.map((w) => w.n).join(' and ') : 'N/A';
  const isLow = score < 11;

  doc.setFillColor(...tintBg);
  doc.setDrawColor(...lightLine);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...deepGreen);
  doc.text('DIAGNOSTIC ADVISORY & SKILL GAP ANALYSIS', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkInk);
  doc.text(
    `Primary focus areas identified: ${weakNames}.`,
    margin + 5,
    y + 12
  );

  const adviceLine1 = isLow
    ? 'To work as a high-income personal trainer or nutrition specialist, comprehensive science-backed'
    : 'You have a commendable knowledge base. To advance to senior coaching roles with elite fitness centers';
  const adviceLine2 = isLow
    ? 'education in biomechanics, posture assessment, and periodization is strictly recommended.'
    : 'or international gyms, formal INPTA certification and clinical practicals will establish full authority.';

  doc.setTextColor(...mutedText);
  doc.text(adviceLine1, margin + 5, y + 17);
  doc.text(adviceLine2, margin + 5, y + 21);

  y += 30;

  // 6. RECOMMENDED FGIIT ROADMAP
  doc.setFillColor(...white);
  doc.setDrawColor(...deepGreen);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...deepGreen);
  doc.text('RECOMMENDED CAREER ACCELERATION: 6-MONTH JOB-READY BATCH', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkInk);
  doc.text(
    '• Curriculum: Anatomy, Physiology, Biomechanics, Clinical Nutrition, Injury Rehab & Client Acquisition',
    margin + 5,
    y + 11
  );
  doc.text(
    '• Mode: Live Online + Classroom Hybrid Batches | Central Govt Approved Certificate with UIN & QR Code',
    margin + 5,
    y + 15
  );
  doc.text(
    '• Career Guarantee: 100% Placement Support with high package opportunities across India and abroad',
    margin + 5,
    y + 19
  );

  y += 26;

  // 7. FOOTER & VERIFICATION STAMP
  doc.setDrawColor(...lightLine);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...deepGreen);
  doc.text('OFFICIAL VERIFICATION & COUNSELLING DESK', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedText);
  doc.text(
    'Direct WhatsApp Guidance: +91 63540 51487  |  Portal: https://fggroup.in  |  INPTA / IPTNA Registered',
    margin,
    y + 4
  );
  doc.text(
    'This diagnostic assessment is generated dynamically by FGIIT Academic Assessment Engine for career guidance.',
    margin,
    y + 8
  );

  // Bottom Accent Bar
  doc.setFillColor(...deepGreen);
  doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

  return doc;
}

/**
 * Convenience helper to download the report directly in the browser
 */
export function downloadCoachReportPDF(report, candidate = {}) {
  const doc = generateCoachReportPDF(report, candidate);
  const safeName = (candidate.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `FGIIT_Coach_Level_Report_${safeName}.pdf`;
  doc.save(filename);
  return filename;
}
