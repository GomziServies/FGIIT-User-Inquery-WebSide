import React from 'react';
import { waLink } from '../data/fgiitData';

export default function WhatsAppFloat() {
  const url = waLink('Hi, I want to know about the FGIIT Job-Ready Batch.');

  return (
    <a
      className="wa"
      id="waFloat"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with FGIIT on WhatsApp"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0B1210"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.5z" />
        <path d="M9 8.5c0 3 2.5 6 6 6.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" />
      </svg>
      <span className="hide-sm">WhatsApp us</span>
    </a>
  );
}
