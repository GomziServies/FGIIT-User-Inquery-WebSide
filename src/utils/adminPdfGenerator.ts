import { jsPDF } from 'jspdf';
import { FG_GROUP_FILE_BASE_URL } from '../../../constants/base_URL';

export interface CoachAssessmentData {
  _id?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  file?: string;
  files?: Array<{ url: string; remark?: string }>;
  details?: {
    score?: string;
    level?: string;
    levelDesc?: string;
    status?: string;
    weakAreas?: string;
    sectionScores?: string;
    categories?: Array<{
      n: string;
      got: number;
      total: number;
      p: number;
      color?: string;
    }>;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Resolves a full downloadable/viewable URL for any file path or S3 key
 */
export function getInquiryFileUrl(pathOrInquiry?: string | CoachAssessmentData): string {
  if (!pathOrInquiry) return '';
  let path = '';
  if (typeof pathOrInquiry === 'string') {
    path = pathOrInquiry;
  } else {
    path = pathOrInquiry.file || pathOrInquiry.files?.[0]?.url || '';
  }

  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl =
    typeof FG_GROUP_FILE_BASE_URL !== 'undefined'
      ? FG_GROUP_FILE_BASE_URL
      : 'https://fg-group.s3.ap-south-1.amazonaws.com';
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/**
 * Checks whether this contact inquiry is an assessment report
 */
export function isCoachLevelAssessment(inquiry?: CoachAssessmentData | null): boolean {
  if (!inquiry) return false;
  if (inquiry.file || (Array.isArray(inquiry.files) && inquiry.files.length > 0)) return true;
  const sub = String(inquiry.subject || '').toLowerCase();
  if (
    sub.includes('coach level') ||
    sub.includes('assessment') ||
    sub.includes('report') ||
    sub.includes('quiz')
  ) {
    return true;
  }
  if (inquiry.details?.score || inquiry.details?.level) return true;
  const msg = String(inquiry.message || '').toLowerCase();
  if (msg.includes('coach level test assessment') || msg.includes('domain breakdown')) return true;
  return false;
}

/**
 * Parses assessment metadata from details or message body
 */
function parseAssessmentData(inquiry: CoachAssessmentData) {
  const details = inquiry.details || {};
  let scoreNum = 11;
  let totalNum = 15;
  let levelTitle = details.level || 'Senior Coach';
  let levelDesc =
    details.levelDesc ||
    'Strong fundamentals across anatomy and programming. Advance your career with specialized credentials.';
  let candidateStatus = details.status || 'Personal Trainer / Fitness Enthusiast';
  let weakAreas = details.weakAreas || 'Assessment & safety, Nutrition';

  if (details.score && typeof details.score === 'string') {
    const parts = details.score.split('/');
    if (parts.length === 2) {
      scoreNum = parseInt(parts[0], 10) || scoreNum;
      totalNum = parseInt(parts[1], 10) || totalNum;
    }
  } else if (inquiry.message) {
    const scoreMatch = inquiry.message.match(/Score:\s*(\d+)\s*\/\s*(\d+)/i);
    if (scoreMatch) {
      scoreNum = parseInt(scoreMatch[1], 10);
      totalNum = parseInt(scoreMatch[2], 10);
    }
    const levelMatch = inquiry.message.match(/Score:.*?\((\w+.*?)\)/i);
    if (levelMatch) {
      levelTitle = levelMatch[1].trim();
    }
    const statusMatch = inquiry.message.match(/Current Status:\s*(.*?)(?:\n|$)/i);
    if (statusMatch) {
      candidateStatus = statusMatch[1].trim();
    }
    const weakMatch = inquiry.message.match(/Lowest Scoring Focus Areas:\s*(.*?)(?:\n|$)/i);
    if (weakMatch) {
      weakAreas = weakMatch[1].trim();
    }
  }

  // Level classification fallback
  if (!details.level) {
    if (scoreNum >= 14) {
      levelTitle = 'Master Coach';
      levelDesc = 'Top 5% of trainers nationally. You demonstrate elite-level mastery across all exercise science disciplines.';
    } else if (scoreNum >= 11) {
      levelTitle = 'Senior Coach';
      levelDesc = 'Strong grasp of exercise science fundamentals. Ready for high-ticket programming and specialization.';
    } else if (scoreNum >= 8) {
      levelTitle = 'Developing Coach';
      levelDesc = 'Good practical intuition with conceptual gaps in screening, safety, or nutrition biochemistry.';
    } else {
      levelTitle = 'Foundational Learner';
      levelDesc = 'High passion and eagerness to grow. A structured foundational diploma will elevate your career rapidly.';
    }
  }

  // Category breakdown
  let categories = details.categories || [];
  if (!categories || categories.length === 0) {
    const defaultCats = [
      { n: 'Anatomy & physiology', got: Math.min(2, Math.round((scoreNum / totalNum) * 2)), total: 2 },
      { n: 'Training & programming', got: Math.min(3, Math.round((scoreNum / totalNum) * 3)), total: 3 },
      { n: 'Assessment & safety', got: Math.min(2, Math.floor((scoreNum / totalNum) * 2)), total: 2 },
      { n: 'Nutrition', got: Math.min(2, Math.floor((scoreNum / totalNum) * 2)), total: 2 },
      { n: 'Injury & rehab', got: Math.min(2, Math.round((scoreNum / totalNum) * 2)), total: 2 },
      { n: 'Ethics & scope', got: Math.min(2, Math.round((scoreNum / totalNum) * 2)), total: 2 },
      { n: 'Business & marketing', got: Math.min(2, Math.round((scoreNum / totalNum) * 2)), total: 2 },
    ];
    categories = defaultCats.map((c) => ({
      ...c,
      p: Math.round((c.got / c.total) * 100),
      color: c.got === c.total ? '#4A630B' : c.got === 0 ? '#D32F2F' : '#9BC028',
    }));
  }

  return {
    scoreNum,
    totalNum,
    percentage: Math.round((scoreNum / totalNum) * 100),
    levelTitle,
    levelDesc,
    candidateStatus,
    weakAreas,
    categories,
  };
}

/**
 * Generates an official, high-resolution FGIIT Coach Level Diagnostic Assessment Report in PDF format.
 */
export function generateCoachReportPDF(inquiry: CoachAssessmentData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const parsed = parseAssessmentData(inquiry);
  const candidateName = inquiry.name || 'Candidate';
  const candidatePhone = inquiry.mobile || (inquiry as any).phone || 'N/A';
  const candidateEmail = inquiry.email || 'N/A';

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
  doc.setFillColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');
  y += 2;

  // 1. HEADER SECTION
  doc.setFillColor(tintBg[0], tintBg[1], tintBg[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // Institution title
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FGIIT · FITNESS WITH GOMZI INTERNATIONAL INSTITUTE OF TEACHING', margin + 6, y + 8);

  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'INPTA Accredited · IPTNA Member · ISO 9001:2015 Certified · Central Govt Recognized Skill Partner',
    margin + 6,
    y + 14
  );
  doc.text(
    'Head Office: 2, GOMZI Abhushan, Char Rasta, Katargam, Surat, Gujarat 395008 | Phone: +91 88668 42520',
    margin + 6,
    y + 19
  );

  y += 28;

  // Report Title & Meta
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COACH LEVEL DIAGNOSTIC ASSESSMENT REPORT', margin, y + 4);

  const reportId = inquiry._id
    ? `FGIIT-CLR-${inquiry._id.slice(-6).toUpperCase()}`
    : `FGIIT-CLR-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`Report ID: ${reportId}  |  Assessment Date: ${dateStr}`, margin, y + 10);

  y += 15;

  // 2. CANDIDATE PROFILE CARD
  doc.setDrawColor(lightLine[0], lightLine[1], lightLine[2]);
  doc.setFillColor(white[0], white[1], white[2]);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.text('CANDIDATE INFORMATION', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.text(`Candidate Name: ${candidateName}`, margin + 5, y + 13);
  doc.text(`WhatsApp: ${candidatePhone}`, margin + 65, y + 13);
  doc.text(`Email: ${candidateEmail}`, margin + 120, y + 13);

  doc.setFontSize(8.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`Current Status: ${parsed.candidateStatus}`, margin + 5, y + 18);

  y += 25;

  // 3. OVERALL SCORE & LEVEL BADGE
  const scoreCardWidth = 56;
  const scoreCardHeight = 44;

  // Left: Score Gauge Box
  doc.setFillColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.roundedRect(margin, y, scoreCardWidth, scoreCardHeight, 3, 3, 'F');

  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('OVERALL SCORE', margin + scoreCardWidth / 2, y + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(`${parsed.scoreNum}/${parsed.totalNum}`, margin + scoreCardWidth / 2, y + 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(tintBg[0], tintBg[1], tintBg[2]);
  doc.text(`${parsed.percentage}% Proficiency`, margin + scoreCardWidth / 2, y + 33, { align: 'center' });

  // Right: Classification Box
  const classBoxX = margin + scoreCardWidth + 5;
  const classBoxWidth = contentWidth - scoreCardWidth - 5;

  doc.setFillColor(white[0], white[1], white[2]);
  doc.setDrawColor(lightLine[0], lightLine[1], lightLine[2]);
  doc.roundedRect(classBoxX, y, classBoxWidth, scoreCardHeight, 3, 3, 'FD');

  // Badge pill
  doc.setFillColor(tintBg[0], tintBg[1], tintBg[2]);
  doc.roundedRect(classBoxX + 6, y + 6, 44, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.text('ASSESSMENT LEVEL', classBoxX + 8, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.text(parsed.levelTitle, classBoxX + 6, y + 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  const splitLevelDesc = doc.splitTextToSize(parsed.levelDesc, classBoxWidth - 12);
  doc.text(splitLevelDesc, classBoxX + 6, y + 28);

  y += scoreCardHeight + 8;

  // 4. DOMAIN-WISE PERFORMANCE BREAKDOWN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.text('Domain-wise Competency Breakdown', margin, y + 2);
  y += 6;

  // Table Header
  doc.setFillColor(tintBg[0], tintBg[1], tintBg[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.text('Core Competency Domain', margin + 4, y + 5);
  doc.text('Score', margin + 90, y + 5);
  doc.text('Performance Bar', margin + 115, y + 5);
  doc.text('Result', margin + 160, y + 5);
  y += 7;

  // Table Rows
  const barMaxWidth = 38;
  parsed.categories.forEach((cat, index) => {
    const rowY = y + index * 8.5;
    const isEven = index % 2 === 0;

    if (isEven) {
      doc.setFillColor(252, 253, 250);
      doc.rect(margin, rowY, contentWidth, 8.5, 'F');
    }

    // Domain name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
    doc.text(cat.n, margin + 4, rowY + 5.5);

    // Score
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat.got} / ${cat.total}`, margin + 90, rowY + 5.5);

    // Visual Progress Bar
    const barX = margin + 115;
    const barY = rowY + 3;
    const barHeight = 3.5;
    doc.setFillColor(232, 238, 235);
    doc.roundedRect(barX, barY, barMaxWidth, barHeight, 1.5, 1.5, 'F');

    const fillWidth = Math.max(1.5, (cat.got / cat.total) * barMaxWidth);
    doc.setFillColor(deepGreen[0], deepGreen[1], deepGreen[2]);
    doc.roundedRect(barX, barY, fillWidth, barHeight, 1.5, 1.5, 'F');

    // Percentage
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const pColor = cat.p >= 75 ? deepGreen : cat.p >= 50 ? [180, 130, 20] : [190, 50, 40];
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text(`${cat.p}%`, margin + 160, rowY + 5.5);

    // Bottom divider
    doc.setDrawColor(lightLine[0], lightLine[1], lightLine[2]);
    doc.line(margin, rowY + 8.5, margin + contentWidth, rowY + 8.5);
  });

  y += parsed.categories.length * 8.5 + 8;

  // 5. DIAGNOSTIC FINDINGS & RECOMMENDATIONS
  doc.setFillColor(tintBg[0], tintBg[1], tintBg[2]);
  doc.setDrawColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.text('DIAGNOSTIC ADVISORY & CAREER ROADMAP', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.text(
    `Immediate Skill Upgrade Focus Areas: ${parsed.weakAreas}`,
    margin + 6,
    y + 14
  );

  const advice1 =
    '1. Enroll in practical biomechanics & movement screening (FGIIT In-Gym Masterclass) to bridge exercise safety gaps.';
  const advice2 =
    '2. Attain INPTA / IPTNA accredited certification to command 3x higher personal training retainers & corporate clients.';
  const advice3 =
    '3. Book your 1-on-1 career consultation call with FGIIT Senior Faculty (+91 88668 42520) for customized pathway.';

  doc.setFontSize(8);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(advice1, margin + 6, y + 21);
  doc.text(advice2, margin + 6, y + 26);
  doc.text(advice3, margin + 6, y + 31);

  y += 42;

  // 6. OFFICIAL ACCREDITATION FOOTER & BADGES
  const footerBoxHeight = 20;
  doc.setFillColor(white[0], white[1], white[2]);
  doc.setDrawColor(lightLine[0], lightLine[1], lightLine[2]);
  doc.roundedRect(margin, y, contentWidth, footerBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(deepGreen[0], deepGreen[1], deepGreen[2]);
  doc.text('ACCREDITED & RECOGNIZED BY:', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkInk[0], darkInk[1], darkInk[2]);
  doc.text(
    'INPTA (International Nutrition & Personal Training Association) · IPTNA (International Personal Training Association)',
    margin + 5,
    y + 12
  );
  doc.text(
    'ISO 9001:2015 Certified Educational Institute · Skill India Training Center Partner · GOMZI Life Sciences Group',
    margin + 5,
    y + 16.5
  );

  // Bottom Disclaimer Bar
  doc.setFontSize(7);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    'This is an automated diagnostic assessment generated by FGIIT. For inquiries, visit fgiit.com or call +91 88668 42520.',
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Downloads the Assessment PDF directly to candidate or admin machine
 */
export function downloadCoachReportPDF(inquiry: CoachAssessmentData, customFilename?: string): void {
  const fileUrl = getInquiryFileUrl(inquiry);
  const cleanName = (inquiry.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = customFilename || `FGIIT_Coach_Level_Report_${cleanName}.pdf`;

  try {
    const doc = generateCoachReportPDF(inquiry);
    doc.save(filename);
  } catch (err) {
    console.error('Error generating coach report PDF:', err);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
}

/**
 * Opens the Assessment PDF in a new browser window/tab
 */
export function openCoachReportPDF(inquiry: CoachAssessmentData): void {
  const fileUrl = getInquiryFileUrl(inquiry);
  try {
    const doc = generateCoachReportPDF(inquiry);
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('Error previewing coach report PDF:', err);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
}
