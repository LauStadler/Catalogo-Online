"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';


interface BannerCarouselProps {
  images: {
    src: StaticImageData;
    alt: string;
    position?: string;
  }[];
}

export default function BannerCarousel({ images }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handlePrev();
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNext();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden group style-banner-section">
      <section 
        className="w-full relative overflow-hidden"
        style={{ height: 'calc(100vh - 78px)' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-white ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Original image centered and fully visible with custom crop position */}
            <Image
              src={image.src}
              alt={image.alt}
              placeholder="blur"
              fill
              className={`object-cover ${image.position || 'object-center'}`}
              priority={index === 0}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer shadow-md hover:scale-105 active:scale-95"
              aria-label="Anterior banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer shadow-md hover:scale-105 active:scale-95"
              aria-label="Siguiente banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
