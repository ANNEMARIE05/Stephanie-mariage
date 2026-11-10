"use client";

import Image from "next/image";
import { photos } from "@/app/lib/wedding";
import { ArrowIcon, HeartIcon } from "./Icons";
import { useCarousel } from "./useCarousel";

export default function Gallery() {
  const slides = photos.gallery;
  const { index, next, prev, goTo, handlers } = useCarousel(slides.length, { interval: 5000 });

  return (
    <div className="gallery" role="region" aria-roledescription="carrousel" aria-label="Galerie photo" tabIndex={0} {...handlers}>
      <div className="gallery-stage">
        {slides.map((slide, i) => {
          const offset = (i - index + slides.length) % slides.length;
          const pos = offset === 0 ? "is-active" : offset === 1 ? "is-next" : offset === slides.length - 1 ? "is-prev" : "is-hidden";
          return (
            <figure
              key={slide.src}
              className={`gallery-slide ${pos}`}
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${slides.length}`}
              aria-hidden={offset !== 0}
              onClick={() => offset !== 0 && goTo(i)}
            >
              <div className="gallery-frame">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 760px) 86vw, 46vw"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
              <figcaption>
                <HeartIcon size={14} /> {slide.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="carousel-nav">
        <button className="carousel-arrow" onClick={prev} aria-label="Photo précédente">
          <ArrowIcon direction="left" size={18} />
        </button>
        <div className="carousel-dots" role="tablist" aria-label="Choisir une photo">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1} : ${slide.caption}`}
              className={i === index ? "is-active" : ""}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={next} aria-label="Photo suivante">
          <ArrowIcon size={18} />
        </button>
      </div>
      <p className="gallery-counter" aria-live="polite">
        <span>{String(index + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")}
      </p>
    </div>
  );
}
