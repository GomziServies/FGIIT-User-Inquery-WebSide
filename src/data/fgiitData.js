export const CONFIG = {
  SUBMIT_URL: import.meta.env.VITE_SUBMIT_URL || '',
  WHATSAPP: import.meta.env.VITE_WHATSAPP_NUMBER || '918866842520',
  PHONE_DISPLAY: import.meta.env.VITE_PHONE_DISPLAY || '+91 88668 42520',
  API_URL: import.meta.env.VITE_API_URL || '',
  PAYMENT_LINKS: {
    pt: '',
    dn: '',
    aas: '',
    pl: '',
    gi: '',
    ir: '',
    nt: '',
  },
  DEMO_SLOTS: [
    ['8:00 – 9:00 AM', true],
    ['10:00 – 11:00 AM', false],
    ['12:00 – 1:00 PM', true],
    ['2:30 – 3:30 PM', false],
    ['5:00 – 6:00 PM', true],
    ['7:00 – 8:00 PM', true],
  ],
  DEMO_DAYS_AHEAD: 6,
};

export const waLink = (msg) =>
  `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const okPhone = (p) => /^[6-9]\d{9}$/.test(p);
export const okEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

export async function sendTelemetry(type, data) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const payload = {
    type,
    submittedAt: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.href : '',
    utmSource: params ? params.get('utm_source') || '' : '',
    utmCampaign: params ? params.get('utm_campaign') || '' : '',
    ...data,
  };

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event: `fgiit_${type}`, ...payload });
  }

  if (!CONFIG.SUBMIT_URL) {
    console.info(`[FGIIT Telemetry: ${type}] (Dry-run: CONFIG.SUBMIT_URL not set)`, payload);
    return Promise.resolve({ dryRun: true });
  }

  try {
    const res = await fetch(CONFIG.SUBMIT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return res;
  } catch (err) {
    console.error(`Failed to dispatch telemetry for ${type}:`, err);
    return null;
  }
}

/**
 * Uploads a file (PDF/Blob/Image) to the fg-api S3 storage
 *
 * @param {Blob|File} blobOrFile
 * @param {string} [filename='assessment_report.pdf']
 * @returns {Promise<{ success: boolean, url: string, data?: any }>}
 */
export async function uploadInquiryFile(blobOrFile, filename = 'assessment_report.pdf') {
  if (!blobOrFile) return { success: false, url: '' };

  const formData = new FormData();
  formData.append('files', blobOrFile, filename);

  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));

  const endpoints = [];
  if (CONFIG.API_URL) {
    endpoints.push(`${CONFIG.API_URL.replace(/\/+$/, '')}/public/v1/file-upload`);
  }
  if (isLocal) {
    endpoints.push('http://127.0.0.1:80/public/v1/file-upload');
    endpoints.push('http://localhost:80/public/v1/file-upload');
  }
  endpoints.push('https://api.fggroup.in/public/v1/file-upload');

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        const fileUrl = json?.data?.fileLocations?.[0] || json?.data?.fileURLs?.[0];
        if (fileUrl) {
          console.info(`[FGIIT fg-api] File uploaded successfully: ${fileUrl}`);
          return { success: true, url: fileUrl, data: json };
        }
      }
    } catch (err) {
      console.warn(`[FGIIT fg-api] File upload connection error to ${url}:`, err.message);
    }
  }
  return { success: false, url: '' };
}

/**
 * Submits an inquiry directly to the FG Group backend (fg-api)
 * to be viewed in gomzi-admin under FGIIT > Contact Inquiries
 *
 * @param {Object} params
 * @param {string} params.name - Full name
 * @param {string} [params.email] - Email address (auto-falls back to mobile@fgiit.in if omitted)
 * @param {string} params.mobile - 10-digit mobile number
 * @param {string} [params.subject='Coach Level Test Assessment:'] - Subject line displayed in admin panel
 * @param {string} params.message - Full formatted message / quiz results
 * @param {string} [params.source] - Page source URL
 * @param {string} [params.file] - Attached primary file URL (e.g. S3 PDF report link)
 * @param {Array<{ url: string, remark?: string }>} [params.files] - Additional file attachments
 * @param {Object} [params.details] - Arbitrary metadata object
 */
export async function submitContactInquiry({
  name,
  email,
  mobile,
  subject = 'Coach Level Test Assessment:',
  message,
  source,
  details,
  file,
  files,
}) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(-10);
  const resolvedEmail =
    email && email.trim() && okEmail(email.trim())
      ? email.trim()
      : `${cleanMobile || 'student'}@fgiit.in`;

  const resolvedSource =
    source ||
    (typeof window !== 'undefined' && window.location.href) ||
    'https://fgiit.com/#test';

  const payload = {
    name: String(name || '').trim(),
    email: resolvedEmail,
    mobile: cleanMobile,
    subject: subject || 'Coach Level Test Assessment:',
    message: String(message || '').trim(),
    source: resolvedSource,
    details: details || {},
  };

  if (file) {
    payload.file = file;
  }
  if (files && Array.isArray(files) && files.length > 0) {
    payload.files = files;
  }

  // Determine endpoint priority:
  // If running locally, hit the local fg-api instance on port 80 first.
  // Then fallback to the production api.fggroup.in.
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));

  const endpoints = [];
  if (CONFIG.API_URL) {
    endpoints.push(`${CONFIG.API_URL.replace(/\/+$/, '')}/public/v1/contact-inquiry`);
  }
  if (isLocal) {
    endpoints.push('http://127.0.0.1:80/public/v1/contact-inquiry');
    endpoints.push('http://localhost:80/public/v1/contact-inquiry');
    endpoints.push('http://127.0.0.1:8080/public/v1/contact-inquiry');
    endpoints.push('http://localhost:8080/public/v1/contact-inquiry');
  }
  endpoints.push('https://api.fggroup.in/public/v1/contact-inquiry');

  let lastError = null;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({ status: res.status }));
        console.info(`[FGIIT fg-api] Contact inquiry saved successfully via ${url}:`, json);
        return { success: true, data: json, endpoint: url };
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn(`[FGIIT fg-api] ${url} returned ${res.status}:`, errJson);
        lastError = errJson?.message || `HTTP ${res.status}`;
      }
    } catch (err) {
      console.warn(`[FGIIT fg-api] Connection error for ${url}:`, err.message);
      lastError = err.message;
    }
  }

  // Backup telemetry call
  await sendTelemetry('course_inquiry_fallback', payload);

  return { success: false, error: lastError };
}

export const CATS = [
  'Anatomy & physiology',
  'Training & programming',
  'Assessment & safety',
  'Nutrition',
  'Injury & rehab',
  'Ethics & scope',
  'Business & marketing',
];

export const QUESTIONS = [
  {
    cat: 0,
    text: 'Which muscle is the prime mover for hip extension in a barbell back squat?',
    opts: ['Rectus femoris', 'Gluteus maximus', 'Iliopsoas', 'Tibialis anterior'],
    ans: 1,
  },
  {
    cat: 0,
    text: 'Which energy system mainly fuels a 10-second all-out sprint?',
    opts: ['ATP-PC (phosphagen) system', 'Aerobic system', 'Fat oxidation', 'Ketone metabolism'],
    ans: 0,
  },
  {
    cat: 1,
    text: 'Which rep range best builds maximal strength?',
    opts: ['15–20 reps', '20–30 reps', '1–5 reps', '30+ reps'],
    ans: 2,
  },
  {
    cat: 1,
    text: 'Progressive overload means:',
    opts: [
      'Training to failure every set',
      'Changing all exercises every session',
      'Doing more cardio each week',
      'Gradually increasing training stress over time',
    ],
    ans: 3,
  },
  {
    cat: 2,
    text: 'The first step with a new client should be:',
    opts: [
      'A 1-rep max test',
      'A diet plan',
      'Selling a supplement stack',
      'Health screening (PAR-Q) and consultation',
    ],
    ans: 3,
  },
  {
    cat: 2,
    text: 'A client gets chest pain during cardio. You should:',
    opts: [
      'Ask them to push through',
      'Stop immediately and get medical help',
      'Lower the speed slightly',
      'Give water and continue',
    ],
    ans: 1,
  },
  {
    cat: 3,
    text: 'Calories per gram of protein, carbohydrate and fat are:',
    opts: ['4, 4 and 9', '4, 9 and 4', '9, 4 and 4', '7, 4 and 9'],
    ans: 0,
  },
  {
    cat: 3,
    text: 'A good daily protein target for adults doing strength training is:',
    opts: ['0.3 g per kg', '5 g per kg', '10 g per kg', '1.6–2.2 g per kg'],
    ans: 3,
  },
  {
    cat: 3,
    text: 'For fat loss, the one non-negotiable is:',
    opts: [
      'Fasted cardio',
      'A sustained calorie deficit',
      'Detox tea',
      'No carbs after 7 pm',
    ],
    ans: 1,
  },
  {
    cat: 4,
    text: 'Right after an acute ankle sprain, the best approach is:',
    opts: [
      'Protect, rest, compress and reload gradually',
      'Deep massage and heavy training',
      'Ignore it and train',
      'Stretch it hard',
    ],
    ans: 0,
  },
  {
    cat: 4,
    text: 'Within a trainer’s scope of practice, you can:',
    opts: [
      'Diagnose medical conditions',
      'Prescribe medicines',
      'Prescribe injections',
      'Design exercise and refer to a doctor or physio',
    ],
    ans: 3,
  },
  {
    cat: 5,
    text: 'A client asks you to supply steroids for quick results. You should:',
    opts: [
      'Sell them a cycle',
      'Explain the risks, stay in your scope and refer to a doctor',
      'Give them dosing over WhatsApp',
      'Ignore the question',
    ],
    ans: 1,
  },
  {
    cat: 6,
    text: 'The best way to keep clients for the long term is:',
    opts: [
      'Constant discounts',
      'Never giving feedback',
      'Training them harder every session',
      'Tracking and showing measurable progress regularly',
    ],
    ans: 3,
  },
  {
    cat: 6,
    text: 'Which social media content brings a trainer the most quality leads?',
    opts: [
      'Client results and educational posts (with consent)',
      'Random memes',
      'Only gym selfies',
      'Bought followers',
    ],
    ans: 0,
  },
  {
    cat: 6,
    text: 'Which is a SMART goal?',
    opts: [
      'Get fit soon',
      'Look better',
      'Be healthy',
      'Lose 4 kg in 8 weeks with 3 sessions a week',
    ],
    ans: 3,
  },
];

export const COURSES = {
  pt: {
    id: 'pt',
    name: 'Diploma in Personal Trainer',
    dur: '6–8 months',
    price: '₹2,999',
    intro:
      'The foundation course in exercise science, with theory and practicals to work as a qualified personal trainer.',
    syllabus: [
      'Human anatomy',
      'Human physiology',
      'Endocrine system',
      'Biomechanics & kinesiology',
      'All-muscle practical exercise sessions',
      'Scheduling of exercise',
      'Different energy systems',
      'Types of grips in exercises',
      'Biomechanical implementation',
      'Principles of exercise',
      'Posture analysis & exercise prescription',
      'Sport-specific training',
      'Basics of dietetics',
      'Job placement & interview training',
    ],
  },
  dn: {
    id: 'dn',
    name: 'Diploma in Nutrition',
    dur: '6–8 months',
    price: '₹2,999',
    intro:
      'For trainers and nutritionists who want to plan diets for active people, clients with health conditions and athletes.',
    syllabus: [
      'Carbohydrates, proteins and lipids',
      'Water, vitamins and minerals',
      'Energy metabolism',
      'Physiology and anatomy',
      'Endocrine system',
      'Blood reports',
      'Fundamentals of meal planning',
      'Food groups and food exchange list',
      'Nutrition in the life cycle and old age',
      'Therapeutic diets, fluid diet and tube feeding',
      'Gastrointestinal disorders',
      'Metabolic and cardiovascular disorders',
      'Menopause, febrile and musculoskeletal disorders',
      'Diet for skin, hair and nails',
      'Nutrition for night-shift workers',
      'Food allergies and intolerance',
      'Weight management and obesity',
      'Counselling skills',
      'Sports nutrition and supplements',
      'How to make a diet plan',
    ],
  },
  aas: {
    id: 'aas',
    name: 'Anabolic Androgenic Steroids Masterclass',
    dur: '1.5 months',
    price: '₹2,999',
    intro:
      'Knowledge of anabolic substances, their safety and complications, for everyone involved in sport.',
    syllabus: [
      'Anabolics, androgenics, peptides and SARMs',
      'Endocrine system',
      'Peak week: cutting and bulking',
      'Managing gyno',
      'Post-cycle therapy (PCT)',
      'Blood tests and how to read reports',
      'Diuretics',
      'Side effects and precautions',
      'Hair loss, acne, mood swings and insomnia',
      'Sexual health',
      'Cycle designing',
      'Bodybuilding, men’s physique and bikini',
      'Powerlifting',
      'Women and steroids',
      'Doping',
      'How physiology works',
      'How to make a diet plan',
    ],
  },
  pl: {
    id: 'pl',
    name: 'Powerlifting Coach Masterclass',
    dur: '1.5 months',
    price: '₹2,999',
    intro:
      'Everything from biomechanics to programming, coaching ethics and competition rules. Zoom sessions on Saturday and Sunday.',
    syllabus: [
      'Introduction to powerlifting',
      'Biomechanics and technique',
      'Strength training principles',
      'Programming and training plans',
      'Equipment and gear',
      'Rules and regulations',
      'Injury prevention and rehabilitation',
      'Coaching and communication',
      'Practical training',
      'Legal aspects of coaching',
      'Powerlifting plan',
    ],
  },
  gi: {
    id: 'gi',
    name: 'Group Instructor Masterclass',
    dur: '1.5 months',
    price: '₹2,999',
    intro: 'Plan and lead high-energy group classes with confidence.',
    syllabus: [
      'Fundamentals of group training',
      'Biomechanics and movement science',
      'Functional training',
      'Tabata and HIIT training',
      'TRX suspension training',
      'Core training techniques',
      'Strength and endurance training',
      'Mobility and flexibility',
      'Warm-up and cool-down protocols',
      'Workout programming and class structuring',
      'Periodization basics',
      'Coaching, cueing, voice and command',
      'Client handling and group management',
      'Injury prevention and modifications',
      'Fat loss and conditioning',
      'Live class execution',
      'Business, career and personal branding',
    ],
  },
  ir: {
    id: 'ir',
    name: 'Injury Rehabilitation Masterclass',
    dur: '1.5 months',
    price: '₹2,999',
    intro:
      'Prevent and manage gym and sports injuries with the right exercise and hands-on techniques.',
    syllabus: [
      'Assessment and diagnosis',
      'Cupping therapy',
      'Principles of exercise prescription',
      'Therapeutic modalities',
      'Manual therapy techniques',
      'Pain management',
      'Injury-specific rehab',
      'Special populations in rehab',
      'CPR',
      'Taping',
      'Dry needling',
    ],
  },
};

export const COURSE_ORDER = ['pt', 'dn', 'aas', 'pl', 'gi', 'ir'];

export const MONTHS = [
  {
    num: 'M1',
    title: 'Foundations of the body',
    items: [
      'Anatomy and physiology',
      'Hormones and the endocrine system',
      'Biomechanics and kinesiology',
      'Energy systems',
    ],
  },
  {
    num: 'M2',
    title: 'Training science',
    items: [
      'All-muscle practical sessions',
      'Warm-up, stretching and mobility',
      'Program design and periodization',
      'Group training formats',
    ],
  },
  {
    num: 'M3',
    title: 'Nutrition',
    items: [
      'Macros, vitamins and minerals',
      'Indian diet plans for fat loss and muscle',
      'Reading blood reports',
      'Supplements',
    ],
  },
  {
    num: 'M4',
    title: 'Special populations & rehab',
    items: [
      'Posture analysis and correction',
      'Injury prevention and rehab',
      'Diabetes, PCOS, thyroid and BP clients',
      'CPR and first aid',
    ],
  },
  {
    num: 'M5',
    title: 'Coaching & business',
    items: [
      'Client consultation and assessment',
      'Selling PT packages',
      'Instagram and personal branding',
      'Ethics and scope of practice',
    ],
  },
  {
    num: 'M6',
    title: 'Career launch',
    items: [
      'Theory and practical exam',
      'Mock PT sessions',
      'CV, portfolio and interview training',
      'Internship and job placement',
    ],
  },
];

export const JOURNEY = [
  { num: '1', title: 'Admission', desc: 'Join online or offline.' },
  { num: '2', title: 'Course', desc: '6 months of classes and practicals.' },
  { num: '3', title: 'Exam', desc: 'Theory and practical assessment.' },
  { num: '4', title: 'Certificate', desc: 'Verifiable with UIN and QR code.' },
  { num: '5', title: 'Internship', desc: 'Real floor experience with clients.' },
  { num: '6', title: 'Job placement', desc: '100% placement, India or abroad.' },
];

export const CERT_STEPS = [
  { num: 'Day 1', title: 'Apply online', desc: 'Fill the form and pay the fee.' },
  { num: 'Day 2', title: '100-mark MCQ exam', desc: 'Online objective test.' },
  { num: 'Day 4', title: 'Viva', desc: 'A short oral interview with our panel.' },
  {
    num: 'Within 72 hours',
    title: 'Certificate at your door',
    desc: 'Delivered to your home by post or courier.',
  },
];

export const CERT_ONLY = [
  { name: 'Diploma in Personal Trainer', price: '₹33,777', kind: 'big' },
  { name: 'Diploma in Nutrition', price: '₹33,777', kind: 'big' },
  { name: 'Group Instructor Masterclass', price: '₹7,080', kind: 'small' },
  { name: 'Injury Rehabilitation Masterclass', price: '₹7,080', kind: 'small' },
  { name: 'Powerlifting Coach Masterclass', price: '₹7,080', kind: 'small' },
];

export const CERT_IMGS = [
  { file: 'cert-pt.jpg', alt: 'Personal Trainer' },
  { file: 'cert-dn.jpg', alt: 'Nutrition' },
  { file: 'cert-gi.jpg', alt: 'Group Instructor' },
  { file: 'cert-ir.jpg', alt: 'Injury Rehabilitation' },
  { file: 'cert-pl.jpg', alt: 'Powerlifting Coach' },
];

export const GALLERY = [
  { file: 'rehab-lab.jpg', caption: 'Injury rehab practical lab' },
  { file: 'assessment.jpg', caption: 'Body composition assessment' },
  { file: 'cpr.jpg', caption: 'CPR training on manikins' },
  { file: 'cupping.jpg', caption: 'Cupping therapy demo' },
  { file: 'gym-floor.jpg', caption: 'Gym-floor coaching session' },
];

export const COACHES = [
  { file: 'ranju.jpg', name: 'Ranju Mohata', course: 'Personal Trainer · 2024' },
  { file: 'maliha.jpg', name: 'Maliha Shaikh', course: 'Nutrition · 2024' },
  { file: 'akash.jpg', name: 'Akash Kale', course: 'Personal Trainer + Nutrition · 2025' },
  { file: 'cert-2.jpg', name: 'Certificate day', course: 'Personal Trainer · 2025' },
  { file: 'harini.jpg', name: 'Harini BS', course: 'Personal Trainer · 2025' },
  { file: 'zain.jpg', name: 'Zain Abuji', course: 'Steroids + Rehab Masterclasses · 2024' },
  { file: 'cert-1.jpg', name: 'Certificate day', course: 'Personal Trainer · 2025' },
  { file: 'jeremiah.jpg', name: 'Jeremiah Dkhar', course: 'Steroids Masterclass · 2026' },
];

export const FAQS = [
  {
    q: 'Who can join the Job-Ready Batch?',
    a: 'Anyone after 10th or 12th who wants a fitness career, plus working trainers who want to upskill. No gym experience needed.',
  },
  {
    q: 'Does the ₹2,999 course include a certificate?',
    a: 'The ₹2,999 courses and the ₹4,777 Nutri-Trainer Combo are knowledge only, without certificate, with live and pre-recorded classes and free e-books. To get certified, give the 100-mark MCQ exam and viva, and receive your certificate in 7 days.',
  },
  {
    q: 'Will I get a job after the Job-Ready Batch?',
    a: 'Yes. After you clear the exam and complete your internship, our placement cell gives you 100% job placement with a handsome salary package, in India or abroad.',
  },
  {
    q: 'Are classes online or offline?',
    a: 'Online and classroom batches run live at the same time, so you can join from anywhere. Offline courses are also available in select cities.',
  },
  {
    q: 'I already have the knowledge. Can I get only the certificate?',
    a: 'Yes. Certificates start at ₹7,080 (₹33,777 for a diploma, payable in 2 parts). Apply online, give the 100-mark MCQ exam on day 2 and the viva on day 4. Your certificate reaches your home by post or courier within 72 hours after that. It is Central Government approved, internationally valid and valid for life.',
  },
  {
    q: 'How can an employer verify my certificate?',
    a: 'Every FGIIT certificate carries a certificate number, UIN and QR code, with INPTA, IPTNA and ISO 9001:2015 marks.',
  },
];

export function getDemoDays() {
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const out = [];
  const now = new Date();
  for (let k = 1; out.length < CONFIG.DEMO_DAYS_AHEAD && k < 20; k++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k);
    if (d.getDay() === 0) continue; // Skip Sundays
    out.push(`${wd[d.getDay()]}, ${d.getDate()} ${mo[d.getMonth()]}`);
  }
  return out;
}

export function calculateScore(answers) {
  const per = CATS.map(() => ({ got: 0, total: 0 }));
  let score = 0;

  QUESTIONS.forEach((q, i) => {
    per[q.cat].total++;
    if (answers[i] === q.ans) {
      per[q.cat].got++;
      score++;
    }
  });

  const cats = CATS.map((n, i) => {
    const p = Math.round((per[i].got / per[i].total) * 100);
    return {
      n,
      got: per[i].got,
      total: per[i].total,
      p,
      color: p >= 70 ? '#4A630B' : p >= 40 ? '#D97706' : '#991B1B',
    };
  });

  const level =
    score >= 14
      ? ['Elite Coach', 'You think like the top coaches in the industry.']
      : score >= 11
      ? ['Advanced Coach', 'A strong base, with a few gaps to close.']
      : score >= 7
      ? ['Gym Trainer', 'You know the basics, but high-income coaches know a lot more.']
      : ['Starter Coach', 'The best time to start learning properly.'];

  const weak = cats.slice().sort((a, b) => a.p - b.p).slice(0, 2);

  return { score, cats, level, weak, totalQuestions: QUESTIONS.length };
}
