import React, { useRef } from 'react';
import { GALLERY } from '../data/fgiitData';
import useAutoScroll from '../hooks/useAutoScroll';

export default function PracticalClasses() {
  const galleryRef = useRef(null);
  useAutoScroll(galleryRef, { interval: 4200 });

  return (
    <section className="wrap section section--tight section--flush-bottom">
      <div className="head">
        <span className="eyebrow">Practical classes</span>
        <h2 className="h2" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)' }}>
          Inside our practical classes
        </h2>
      </div>

      <div
        className="carousel carousel--4"
        id="gallery"
        ref={galleryRef}
        role="region"
        aria-label="Photos from FGIIT practical classes"
      >
        {GALLERY.map((item) => (
          <figure key={item.file} style={{ margin: 0 }}>
            <img
              className="carousel-img"
              src={`/images/${item.file}`}
              alt={item.caption}
              loading="lazy"
            />
            <figcaption style={{ marginTop: '10px', fontSize: '13px', color: 'var(--muted)' }}>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
