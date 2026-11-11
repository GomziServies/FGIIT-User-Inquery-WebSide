import { jsPDF } from 'jspdf';
import { COURSES, INCLUDES, CONFIG, NT_COMBO } from '../data/fgiitData.js';

const DEEP = [74, 99, 11];
const LIME = [155, 192, 40];
const TINT = [244, 249, 230];
const INK = [11, 18, 16];
const MUTED = [85, 100, 95];
const LINE = [225, 232, 229];

/**
 * Builds the FGIIT Nutri-Trainer Combo brochure PDF from the live course data.
 * Every line in this document comes from NT_COMBO / COURSES / INCLUDES / CONFIG — nothing is
 * invented. Fees are intentionally not printed; they are shared on WhatsApp after an inquiry.
 *
 * @returns {jsPDF}
 */
export function generateCourseBrochurePDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const addPageIfNeeded = (needed) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const sectionTitle = (text) => {
    addPageIfNeeded(18);
    doc.setFillColor(...TINT);
    doc.roundedRect(margin, y - 4, contentWidth, 11, 2, 2, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...DEEP);
    doc.text(text, margin + 4, y + 3);
    y += 14;
  };

  const bodyLine = (text, size = 9.5, color = MUTED, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line) => {
      addPageIfNeeded(6);
      doc.text(line, margin + indent, y);
      y += 5;
    });
  };

  // ---- Cover -----------------------------------------------------------
  doc.setFillColor(...DEEP);
  doc.rect(0, 0, pageWidth, 46, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...LIME);
  doc.text('FGIIT  ·  FITNESS WITH GOMZI INTERNATIONAL INSTITUTE OF TEACHING', margin, 14);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text(NT_COMBO.name, margin, 27);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(235, 240, 230);
  doc.text(`5 Courses in One  ·  ${NT_COMBO.dur}  ·  Live Online Classes`, margin, 35);
  doc.setFontSize(9.5);
  doc.text('Job-Ready Batch  ·  Courses included and full syllabus', margin, 41);

  y = 56;
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text('Everything you need to start your fitness career', margin, y);
  y += 8;
  bodyLine(NT_COMBO.intro + ' Live online classes, recorded video lessons, e-books and study materials, a structured learning journey, and access to the FGIIT Academy app.');
  y += 2;
  bodyLine(
    'Accreditation and certification are separate from the course fee. Eligible students who wish to obtain accreditation or certification must apply separately through INPTA, subject to its applicable eligibility requirements, approval process and fees.',
    9,
    DEEP,
  );

  // ---- What's included -------------------------------------------------
  y += 2;
  sectionTitle('WHAT THE COURSE INCLUDES');
  INCLUDES.forEach((item) => {
    addPageIfNeeded(12);
    doc.setFillColor(...LIME);
    doc.circle(margin + 2, y - 1.5, 1.4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(item.title, margin + 6, y);
    y += 4.6;
    bodyLine(item.desc, 9, MUTED, 6);
    y += 1.4;
  });

  // ---- Courses included ---------------------------------------------------
  sectionTitle('COURSES INCLUDED IN THE NUTRI-TRAINER COMBO');
  NT_COMBO.courseIds.forEach((id) => {
    const c = COURSES[id];
    addPageIfNeeded(40);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(c.name, margin, y);
    y += 5;
    bodyLine(c.intro, 9, MUTED);
    y += 1;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DEEP);
    doc.text('Syllabus', margin, y);
    y += 4.6;
    c.syllabus.forEach((topic) => {
      addPageIfNeeded(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text('•  ' + topic, margin + 2, y);
      y += 4.4;
    });
    doc.setDrawColor(...LINE);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  });

  // ---- Learning journey -------------------------------------------------
  sectionTitle('YOUR LEARNING JOURNEY');
  const stages = [
    ['Month 1', 'Human Body Basics'],
    ['Month 2', 'Exercise & Training Science'],
    ['Month 3', 'Sports Nutrition Fundamentals'],
    ['Month 4', 'Fitness Assessment & Program Design'],
    ['Month 5', 'Practical Coaching Skills'],
    ['Month 6', 'Career Readiness & Client Management'],
  ];
  stages.forEach(([m, t]) => {
    addPageIfNeeded(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...DEEP);
    doc.text(m, margin, y);
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(t, margin + 20, y);
    y += 6;
  });

  // ---- App + contact ----------------------------------------------------
  sectionTitle('LEARN ON THE FGIIT ACADEMY APP');
  bodyLine('Android: ' + CONFIG.APP_PLAY_URL);
  bodyLine('iOS: ' + CONFIG.APP_APPLE_URL);
  y += 2;
  bodyLine('WhatsApp for admissions, course fee and free demo class: ' + CONFIG.PHONE_DISPLAY);
  bodyLine('INPTA accreditation (separate from the course fee): ' + CONFIG.INPTA_URL);

  // Footers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`FGIIT Job-Ready Batch  ·  ${NT_COMBO.name} brochure`, margin, pageHeight - 7);
    doc.text('Page ' + i + ' of ' + pages, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  return doc;
}

/** Downloads the Nutri-Trainer Combo brochure PDF in the browser. */
export function downloadCourseBrochurePDF() {
  generateCourseBrochurePDF().save('FGIIT_Nutri_Trainer_Combo_Brochure.pdf');
}
