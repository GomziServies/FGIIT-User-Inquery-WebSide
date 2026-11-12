export const CONFIG = {
  SUBMIT_URL: import.meta.env?.VITE_SUBMIT_URL || '',
  WHATSAPP: import.meta.env?.VITE_WHATSAPP_NUMBER || '916354051487',
  PHONE_DISPLAY: import.meta.env?.VITE_PHONE_DISPLAY || '+91 63540 51487',
  API_URL: import.meta.env?.VITE_API_URL || '',
  INPTA_URL: import.meta.env?.VITE_INPTA_URL || 'https://inpta.fggroup.in/',
  APP_PLAY_URL:
    import.meta.env?.VITE_APP_PLAY_URL ||
    'https://play.google.com/store/apps/details?id=com.fgiit',
  APP_APPLE_URL:
    import.meta.env?.VITE_APP_APPLE_URL ||
    'https://apps.apple.com/us/app/fgiit-academy/id6468647053',
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

/* "Inquiry Now" buttons open WhatsApp chat directly with the admissions number */
export const INQUIRY_WHATSAPP = CONFIG.WHATSAPP;
export const inquiryLink = (course = 'Nutri-Trainer Combo') =>
  `https://wa.me/${INQUIRY_WHATSAPP}?text=${encodeURIComponent(
    `Hello FGIIT Team, I would like to inquire about the ${course} course. Please share the details.`
  )}`;

// 10-digit Indian mobile, or a number with its country code (e.g. 919188666002), up to 15 digits
export const okPhone = (p) => /^(?:[6-9]\d{9}|\d{11,15})$/.test(p);
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
 * Resilient fetch with abort timeout to avoid blocking execution on dead or hanging endpoints
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 2800) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
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

  const uniqueEndpoints = [...new Set(endpoints)];

  for (const url of uniqueEndpoints) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          body: formData,
        },
        3000
      );
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
  // Keep the whole number including any country code (the CRM matches on the last 10 digits)
  const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(0, 15);
  const resolvedEmail =
    email && email.trim() && okEmail(email.trim())
      ? email.trim()
      : `${cleanMobile || 'student'}@fgiit.in`;

  const resolvedSource =
    source ||
    (typeof window !== 'undefined' && window.location.href) ||
    'https://fgiit.com/#test';

  // Sending a form is the visitor's agreement (every form shows a notice saying so). Hand the form's own
  // details to the visitor tracker first: it sends them with the visit activity, so the CRM lead
  // (platform 'website_visitor') exists before this inquiry joins it. Capped at 2.5s so a slow tracker
  // never delays the inquiry itself.
  if (typeof window !== 'undefined' && window.fgTracker && window.fgTracker.consentOnSubmit) {
    try {
      await Promise.race([
        window.fgTracker.consentOnSubmit(
          {
            full_name: String(name || '').trim(),
            phone_number: cleanMobile,
            email: email && okEmail(String(email).trim()) ? String(email).trim() : '',
          },
          subject
        ),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
    } catch {}
  }

  // Tie this submit to the visitor tracker's id so the CRM joins it to the same lead
  // (the partial "website_visitor" lead) instead of creating a duplicate.
  const visitorId =
    (typeof window !== 'undefined' && window.fgTracker && window.fgTracker.visitorId) ||
    (typeof window !== 'undefined' && window.localStorage && (() => { try { return localStorage.getItem('fg_vid'); } catch { return null; } })()) ||
    null;

  const payload = {
    name: String(name || '').trim(),
    email: resolvedEmail,
    mobile: cleanMobile,
    subject: subject || 'Coach Level Test Assessment:',
    message: String(message || '').trim(),
    source: resolvedSource,
    details: { ...(details || {}), ...(visitorId ? { visitor_id: visitorId } : {}) },
  };

  if (file) {
    payload.file = file;
  }
  if (files && Array.isArray(files) && files.length > 0) {
    payload.files = files;
  }

  // Determine endpoint priority with deduplication
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
  }
  endpoints.push('https://api.fggroup.in/public/v1/contact-inquiry');

  const uniqueEndpoints = [...new Set(endpoints)];
  let lastError = null;

  for (const url of uniqueEndpoints) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
        6000
      );

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
  await sendTelemetry('course_inquiry_fallback', payload).catch(() => {});

  return { success: false, error: lastError };
}

/* ================= BACKGROUND INQUIRY QUEUE & WORKER ================= */
const INQUIRY_QUEUE_KEY = 'fgiit_inquiry_queue_v1';

function getInquiryQueue() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(INQUIRY_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveInquiryQueue(queue) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(queue.slice(-25)));
  } catch {}
}

/* ================= USER PROFILE AUTO-FILL SYSTEM ================= */
const USER_PROFILE_KEY = 'fgiit_user_profile_v1';

export function saveUserProfile(profile) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const existing = getUserProfile() || {};
    const updated = {
      ...existing,
      ...profile,
      updatedAt: Date.now(),
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  } catch {}
}

export function getUserProfile() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let isQueueProcessing = false;

/**
 * Processes queued inquiries in the background with auto-retry.
 */
export async function processInquiryQueue() {
  if (isQueueProcessing) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  const queue = getInquiryQueue();
  if (!queue.length) return;

  isQueueProcessing = true;

  try {
    const remaining = [];
    for (const item of queue) {
      try {
        const res = await submitContactInquiry(item.payload);
        if (res?.success) {
          console.info(`[FGIIT Background] Queued inquiry ${item.id} sent successfully`);
          if (item.telemetry) {
            sendTelemetry(item.telemetry.type, item.telemetry.data).catch(() => {});
          }
        } else {
          if ((item.retries || 0) < 5) {
            remaining.push({ ...item, retries: (item.retries || 0) + 1 });
          }
        }
      } catch (err) {
        console.warn(`[FGIIT Background] Item ${item.id} error:`, err?.message || err);
        if ((item.retries || 0) < 5) {
          remaining.push({ ...item, retries: (item.retries || 0) + 1 });
        }
      }
    }
    saveInquiryQueue(remaining);
  } finally {
    isQueueProcessing = false;
  }
}

/**
 * Dispatches a contact inquiry and email notification asynchronously in the background.
 * Returns immediately so page loads and modal confirmation states render with zero lag.
 *
 * @param {Object} params - Inquiry parameters for submitContactInquiry
 * @param {Object} [options]
 * @param {Object} [options.telemetry] - Optional telemetry payload { type, data }
 * @param {Function} [options.onComplete] - Optional callback
 * @returns {string} Unique queue item ID
 */
export function dispatchInquiryInBackground(params, options = {}) {
  const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = {
    id,
    payload: params,
    telemetry: options.telemetry || null,
    createdAt: new Date().toISOString(),
    retries: 0,
  };

  // 1. Immediately persist to queue
  const queue = getInquiryQueue();
  queue.push(item);
  saveInquiryQueue(queue);

  // 2. Fire and forget queue processing in background
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        processInquiryQueue().then(() => options.onComplete?.()).catch(() => {});
      });
    } else {
      setTimeout(() => {
        processInquiryQueue().then(() => options.onComplete?.()).catch(() => {});
      }, 0);
    }
  }

  return id;
}

// Background sync listeners for offline recovery
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processInquiryQueue().catch(() => {});
  });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      processInquiryQueue().catch(() => {});
    }
  });
  // Clear stale queue on initial mount to avoid firing old retries
  try {
    localStorage.removeItem('fgiit_inquiry_queue_v1');
  } catch {}
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
    price: '₹1,999',
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
    price: '₹1,999',
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
    price: '₹1,999',
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

/* Nutri-Trainer Combo — the only programme offered on the website */
export const NT_COMBO = {
  id: 'nt',
  name: 'Nutri-Trainer Combo',
  dur: '6–8 months',
  intro:
    'Five courses in one programme: personal training, nutrition, group instruction, injury rehabilitation and powerlifting.',
  courseIds: ['pt', 'dn', 'gi', 'ir', 'pl'],
  facts: ['5 courses', '6–8 months', 'Live + pre-recorded', 'Free e-books (PDF)', 'Without certificate'],
};


/* What the Nutri-Trainer Combo includes */
export const INCLUDES = [
  {
    id: 'live',
    icon: 'live',
    title: 'Live Online Classes',
    desc: 'Interactive sessions with expert faculty, held live so you can ask questions in the class.',
  },
  {
    id: 'recorded',
    icon: 'play',
    title: 'Recorded Video Lessons',
    desc: 'Revisit every session as many times as you need through the FGIIT Academy application.',
  },
  {
    id: 'ebooks',
    icon: 'book',
    title: 'E-Books & Study Materials',
    desc: 'Digital notes, articles and free e-books (PDF) for all five courses, for revision and reference.',
  },
  {
    id: 'fivecourses',
    icon: 'layers',
    title: '5 Courses in One Combo',
    desc: 'Personal Trainer, Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting — all in one programme.',
  },
  {
    id: 'journey',
    icon: 'route',
    title: 'Structured Learning Journey',
    desc: 'A clear, ordered curriculum across all five courses, so you always know what comes next.',
  },
];

export const ACCREDITATION_NOTE =
  'Accreditation and certification are separate from the course fee. Eligible students who wish to obtain accreditation or certification must apply separately through INPTA, subject to its applicable eligibility requirements, approval process, and fees.';

/* Six learning stages of the Job-Ready Batch journey */
export const TIMELINE = [
  {
    num: 'Month 1',
    title: 'Human Body Basics',
    desc: 'Basic anatomy, physiology and human movement.',
  },
  {
    num: 'Month 2',
    title: 'Exercise & Training Science',
    desc: 'Exercise techniques, training principles, exercise selection and program design.',
  },
  {
    num: 'Month 3',
    title: 'Sports Nutrition Fundamentals',
    desc: 'Macronutrients, micronutrients and practical dietary planning.',
  },
  {
    num: 'Month 4',
    title: 'Fitness Assessment & Program Design',
    desc: 'Client assessments, goal setting and personalised training plans.',
  },
  {
    num: 'Month 5',
    title: 'Practical Coaching Skills',
    desc: 'Communication, exercise instruction, client management and coaching.',
  },
  {
    num: 'Month 6',
    title: 'Career Readiness & Client Management',
    desc: 'Practical application and preparation for fitness industry opportunities.',
  },
];

export const TIMELINE_NOTE =
  'This is the Job-Ready Batch learning journey of the Nutri-Trainer Combo. See the course section above for all five courses it includes.';

/* FGIIT Academy app — official store listings and authentic screenshots */
export const APP = {
  name: 'FGIIT Academy',
  icon: '/images/app/app-icon.png',
  live: {
    src: '/images/online-zoom.jpg',
    alt: 'Students attending a live FGIIT online class on a video call',
  },
  liveAlt: {
    src: '/images/hybrid-wide.jpg',
    alt: 'FGIIT classroom where offline and online students attend the same live class',
  },
  recorded: {
    src: '/images/app/app-journey-screen.jpg',
    alt: 'FGIIT Academy app home screen with the learning dashboard and recorded courses',
  },
  materials: {
    src: '/images/app/app-lesson-screen.jpg',
    alt: 'FGIIT Academy app lecture view with downloadable study material and PDF notes',
  },
  shots: [
    {
      file: 'app-journey-screen.jpg',
      label: 'My Learning',
      alt: 'FGIIT Academy app home screen with the learning dashboard and recorded courses',
    },
    {
      file: 'app-organised-screen.jpg',
      label: 'Curriculum & Lectures',
      alt: 'FGIIT Academy app curriculum list showing structured lecture modules',
    },
    {
      file: 'app-students-screen.jpg',
      label: 'Certified Students',
      alt: 'FGIIT Academy app showing certified students and the courses they completed',
    },
  ],
};

export const JOURNEY = [
  { num: '1', title: 'Admission', desc: 'Join online or offline.' },
  { num: '2', title: 'Course', desc: '6 months of classes and practicals.' },
  { num: '3', title: 'Exam', desc: 'Theory and practical assessment.' },
  { num: '4', title: 'Certificate', desc: 'Verifiable with UIN and QR code.' },
  { num: '5', title: 'Internship', desc: 'Real floor experience with clients.' },
  { num: '6', title: 'Job placement', desc: '100% placement, India or abroad.' },
];

/* Accreditation options applied for separately through INPTA (not part of the course fee) */
export const CERT_OPTIONS = [
  { id: 'pt', name: 'Diploma in Personal Trainer', kind: 'big' },
  { id: 'dn', name: 'Diploma in Nutrition', kind: 'big' },
  { id: 'gi', name: 'Group Instructor Masterclass', kind: 'small' },
  { id: 'ir', name: 'Injury Rehabilitation Masterclass', kind: 'small' },
  { id: 'pl', name: 'Powerlifting Coach Masterclass', kind: 'small' },
];

export const CERT_IMGS = [
  { file: 'cert-pt.jpg', alt: 'Sample Personal Trainer accreditation certificate' },
  { file: 'cert-dn.jpg', alt: 'Sample Nutrition accreditation certificate' },
  { file: 'cert-gi.jpg', alt: 'Sample Group Instructor accreditation certificate' },
  { file: 'cert-ir.jpg', alt: 'Sample Injury Rehabilitation accreditation certificate' },
  { file: 'cert-pl.jpg', alt: 'Sample Powerlifting Coach accreditation certificate' },
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

/* FGIIT-certified students and what they earn now — posters live in /images/placeintern/ */
export const PLACEMENTS = [
  { file: 'fgiit-webinar-placement-1.webp', name: 'Chirag Pandey', role: 'Master Trainer', income: '2.5 Lakh' },
  { file: 'fgiit-webinar-placement-2.webp', name: 'Chirag Chandlekar', role: 'Personal Trainer', income: '1 Lakh' },
  { file: 'fgiit-webinar-placement-5.webp', name: 'Kinjal Pantagia', role: 'Dietitian', income: '1 Lakh' },
  { file: 'fgiit-webinar-placement-3.webp', name: 'Kaushik Parmar', role: 'Personal Trainer', income: '1 Lakh' },
  { file: 'fgiit-webinar-placement-6.webp', name: 'Nisha Jariwala', role: 'Dietitian', income: '1 Lakh' },
  { file: 'fgiit-webinar-placement-4.webp', name: 'Rushabh Joshi', role: 'Personal Trainer', income: '50K' },
];

export const FAQS = [
  {
    q: 'What is the Nutri-Trainer Combo?',
    a: 'It is our complete fitness-career programme: five courses in one — Diploma in Personal Trainer, Diploma in Nutrition, Group Instructor, Injury Rehabilitation and Powerlifting Coach. It runs for 6–8 months with live online classes and recorded lessons.',
  },
  {
    q: 'What is included in the Nutri-Trainer Combo?',
    a: 'Live online classes with expert faculty, recorded video lessons, e-books and study materials for all five courses, a structured learning journey, and access to the FGIIT Academy app where all of it is delivered.',
  },
  {
    q: 'What is the course fee and how do I join?',
    a: 'Tap "Inquiry Now" anywhere on the page. It opens a WhatsApp chat with our admissions team, who will share the current fee, batch dates and the joining process with you.',
  },
  {
    q: 'Are live online classes included?',
    a: 'Yes. Live online sessions are part of the course. They run on a fixed schedule, you can join from your phone or laptop, and every session is also recorded so you can revise it later.',
  },
  {
    q: 'Are recorded videos and e-books included?',
    a: 'Yes. Recorded lessons and free e-books (PDF) for all five courses are included, and all of it is available in the FGIIT Academy app along with lecture notes and other study material.',
  },
  {
    q: 'How can I book a free demo class?',
    a: 'Tap "Join a Free Demo Class" anywhere on the page. You can either ask for a recorded class or pick a live slot from Monday to Saturday, and the class details reach you on WhatsApp.',
  },
  {
    q: 'How can I download the complete course brochure?',
    a: 'Use the "Download the Complete Course Brochure" button in the learning journey section. Share your name, contact number, email and address — the Nutri-Trainer Combo brochure PDF downloads straight to your device and is also emailed to you, and our team follows up on WhatsApp within 24 hours.',
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


/* ================= FGIIT RAZORPAY COURSE ENROLLMENT HELPERS ================= */

/**
 * Creates a Razorpay Order through fg-api for FGIIT Course Enrollment
 * Uses FGIIT gateway credentials configured in fg-api .env.development
 */
export async function createFgiitRazorpayOrder(params) {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));

  const endpoints = [];
  if (CONFIG.API_URL) {
    endpoints.push(`${CONFIG.API_URL.replace(/\/+$/, '')}/public/v1/guest-payment/create-fgiit-order`);
  }
  if (isLocal) {
    endpoints.push('http://127.0.0.1:80/public/v1/guest-payment/create-fgiit-order');
    endpoints.push('http://localhost:80/public/v1/guest-payment/create-fgiit-order');
    endpoints.push('http://127.0.0.1:8080/public/v1/guest-payment/create-fgiit-order');
    endpoints.push('http://localhost:8080/public/v1/guest-payment/create-fgiit-order');
  }
  endpoints.push('https://api.fggroup.in/public/v1/guest-payment/create-fgiit-order');

  const uniqueEndpoints = [...new Set(endpoints)];
  let lastError = null;

  for (const url of uniqueEndpoints) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(params),
        },
        5000
      );

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || json };
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.message || `HTTP ${res.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return { success: false, error: lastError || 'Failed to create payment order' };
}

/**
 * Verifies FGIIT Course Payment, records order in OrdersRepo with itemType FITNESS_COURSE
 * and dispatches official enrollment invoice email via fg-api
 */
export async function verifyFgiitCoursePayment(params) {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));

  const endpoints = [];
  if (CONFIG.API_URL) {
    endpoints.push(`${CONFIG.API_URL.replace(/\/+$/, '')}/public/v1/guest-payment/verify-fgiit-course`);
  }
  if (isLocal) {
    endpoints.push('http://127.0.0.1:80/public/v1/guest-payment/verify-fgiit-course');
    endpoints.push('http://localhost:80/public/v1/guest-payment/verify-fgiit-course');
    endpoints.push('http://127.0.0.1:8080/public/v1/guest-payment/verify-fgiit-course');
    endpoints.push('http://localhost:8080/public/v1/guest-payment/verify-fgiit-course');
  }
  endpoints.push('https://api.fggroup.in/public/v1/guest-payment/verify-fgiit-course');

  const uniqueEndpoints = [...new Set(endpoints)];
  let lastError = null;

  for (const url of uniqueEndpoints) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(params),
        },
        8000
      );

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || json };
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.message || `HTTP ${res.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return { success: false, error: lastError || 'Failed to verify payment' };
}
