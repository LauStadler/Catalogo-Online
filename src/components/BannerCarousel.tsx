"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Touch swipe using refs (avoids React state closure delays and batching)
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);
  const touchEndYRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const diffY = touchStartYRef.current - touchEndYRef.current;

    // Only register horizontal swipes (if horizontal movement is greater than vertical movement)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };



  // Keyboard navigation for desktop
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
    <div className="w-full relative overflow-hidden group style-banner-section select-none">
      <section 
        className="w-full relative overflow-hidden h-[240px] sm:h-[350px] md:h-[calc(100vh-78px)] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-white ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              placeholder="blur"
              fill
              className={`object-cover ${image.position || 'object-center'}`}
              priority={true}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {/* Boton Izquierdo */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={{ left: 'clamp(14px, 2vw, 24px)', right: 'auto' }}
              className="absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer shadow-md hover:scale-105 active:scale-95 touch-manipulation"
              aria-label="Anterior banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Boton Derecho */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{ right: 'clamp(14px, 2vw, 24px)', left: 'auto' }}
              className="absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer shadow-md hover:scale-105 active:scale-95 touch-manipulation"
              aria-label="Siguiente banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </section>
    </div>
  );
}
