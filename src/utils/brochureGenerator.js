import { jsPDF } from 'jspdf';
import { COURSES, COURSE_ORDER, INCLUDES, CONFIG, COMBO_PRICE } from '../data/fgiitData.js';

const DEEP = [74, 99, 11];
const LIME = [155, 192, 40];
const TINT = [244, 249, 230];
const INK = [11, 18, 16];
const MUTED = [85, 100, 95];
const LINE = [225, 232, 229];

/**
 * Builds the FGIIT course brochure PDF straight from the live course catalogue.
 * Every line in this document comes from COURSES / INCLUDES / CONFIG — nothing is invented.
 *
 * @param {string} [courseId] - the course the visitor selected (e.g. 'pt', 'nt')
 * @returns {jsPDF}
 */
export function generateCourseBrochurePDF(courseId) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const selectedId = courseId || '';
  const selectedCourse =
    selectedId === 'nt'
      ? { id: 'nt', name: 'Nutri-Trainer Combo', dur: '6–8 months', price: COMBO_PRICE, intro: 'All courses except the Steroids Masterclass, in one bundle.' }
      : COURSES[selectedId] || null;

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
  doc.text('Job-Ready Batch', margin, 27);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(235, 240, 230);
  doc.text('Six-Month Diploma Online Courses  ·  Live Online Classes', margin, 35);
  doc.setFontSize(9.5);
  doc.text('Course catalogue, durations, fees and full syllabus', margin, 41);

  y = 56;
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text('Everything you need to start your fitness career', margin, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...DEEP);
  doc.text('Just ' + COURSES.pt.price, margin, y);
  y += 8;
  bodyLine(
    'The fee gives you access to one eligible course: live online classes, recorded video lessons, e-books and study materials, a structured learning journey, and access to the FGIIT Academy app.',
  );
  y += 2;
  bodyLine(
    'Accreditation and certification are separate from the course fee. Eligible students who wish to obtain accreditation or certification must apply separately through INPTA, subject to its applicable eligibility requirements, approval process and fees.',
    9,
    DEEP,
  );

  // ---- Selected course ---------------------------------------------------
  if (selectedCourse) {
    y += 4;
    addPageIfNeeded(30);
    doc.setFillColor(...TINT);
    doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...DEEP);
    doc.text('YOUR SELECTED COURSE', margin + 5, y + 7);
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...INK);
    doc.text(selectedCourse.name, margin + 5, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DEEP);
    doc.text(selectedCourse.price, pageWidth - margin - 5, y + 14, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    const selLines = doc.splitTextToSize(
      `${selectedCourse.dur} · Live online classes + recorded lessons · Free e-book. ${selectedCourse.intro}`,
      contentWidth - 10,
    );
    selLines.slice(0, 2).forEach((line, i) => doc.text(line, margin + 5, y + 20 + i * 4.6));
    y += 34;
  }

  // ---- What's included -------------------------------------------------
  sectionTitle('WHAT THE FEE INCLUDES');
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

  // ---- Course catalogue -------------------------------------------------
  sectionTitle('COURSE CATALOGUE');
  // The visitor's selected course is listed first and marked as selected
  const orderedIds = selectedId && selectedId !== 'nt' && COURSE_ORDER.includes(selectedId)
    ? [selectedId, ...COURSE_ORDER.filter((id) => id !== selectedId)]
    : COURSE_ORDER;
  orderedIds.forEach((id) => {
    const c = COURSES[id];
    addPageIfNeeded(40);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(c.name, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DEEP);
    doc.text(c.price, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`${c.dur}  ·  Live online classes + recorded lessons  ·  Free e-book`, margin, y);
    y += 5;
    if (id === selectedId) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DEEP);
      doc.text('YOUR SELECTED COURSE', margin, y);
      y += 4.6;
    }
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

  // ---- Nutri-Trainer combo ---------------------------------------------
  addPageIfNeeded(30);
  doc.setFillColor(...TINT);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text('Nutri-Trainer Combo  ·  ₹4,999', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const comboText = doc.splitTextToSize(
    'All courses in one: Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting. Steroids Masterclass not included. Free e-books included.',
    contentWidth - 10,
  );
  comboText.forEach((line, i) => doc.text(line, margin + 5, y + 14 + i * 4.6));
  y += 32;

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
  bodyLine('Free demo class: ' + CONFIG.WHATSAPP + '  ·  ' + CONFIG.PHONE_DISPLAY);
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
    const footerLabel = selectedCourse
      ? `FGIIT Job-Ready Batch  ·  ${selectedCourse.name} brochure`
      : 'FGIIT Job-Ready Batch  ·  Course brochure';
    doc.text(footerLabel, margin, pageHeight - 7);
    doc.text('Page ' + i + ' of ' + pages, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  return doc;
}

/** Builds a filesystem-safe file name from a course title. */
const brochureFileName = (courseName) => {
  const safe = String(courseName || '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `FGIIT_${safe || 'Course'}_Brochure.pdf`;
};

/**
 * Downloads the brochure PDF in the browser.
 * @param {string} [courseId] - selected course id; used for the file name and to mark the course
 */
export function downloadCourseBrochurePDF(courseId) {
  const doc = generateCourseBrochurePDF(courseId);
  const selected =
    courseId === 'nt'
      ? 'Nutri-Trainer Combo'
      : (COURSES[courseId] && COURSES[courseId].name) || '';
  doc.save(brochureFileName(selected));
}
