import React from 'react';

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

const PATHS = {
  live: (
    <>
      <rect x="2.5" y="4" width="13" height="12" rx="2.5" />
      <path d="m15.5 10.5 5-3v9l-5-3z" />
      <path d="M8.5 8.5v4M10.5 8.5v4" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="4" width="19" height="14" rx="2.5" />
      <path d="m10.5 9 4.5 2.5-4.5 2.5z" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H18a1 1 0 0 1 1 1v13" />
      <path d="M4 4.5V18a3 3 0 0 0 3 3h12v-3.5H6.5A2.5 2.5 0 0 1 4 15" />
      <path d="M8 7.5h7M8 11h5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18.5" r="2.5" />
      <circle cx="18" cy="5.5" r="2.5" />
      <path d="M18 8v4.5a3.5 3.5 0 0 1-3.5 3.5h-5A3.5 3.5 0 0 0 6 19.5V16" />
    </>
  ),
  certificate: (
    <>
      <rect x="3" y="3.5" width="18" height="13" rx="2" />
      <path d="M7.5 8h9M7.5 11.5h5" />
      <circle cx="16.5" cy="18.5" r="3" />
      <path d="m15 20.5 1 2 2.5-3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11" />
      <path d="m7.5 10 4.5 4.5 4.5-4.5" />
      <path d="M4 19.5h16" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
};

export default function Icon({ name, size = 22, className, style }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg {...base} width={size} height={size} className={className} style={style}>
      {path}
    </svg>
  );
}
