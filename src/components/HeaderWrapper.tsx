"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface HeaderWrapperProps {
  children: React.ReactNode;
}

export default function HeaderWrapper({ children }: HeaderWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`bg-green-600 fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out flex items-center ${
        isScrolled 
          ? 'py-3 shadow-lg' 
          : 'py-6 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between relative">
        {/* Unified Logo on the Left - Smooth height transition */}
        <Link href="/" className="hover:opacity-90 transition-opacity flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo_blanco_y_negro.png" 
            alt="Logo Tecnifer" 
            className="w-auto object-contain transition-all duration-300 ease-in-out"
            style={{ 
              height: isScrolled ? '24px' : '30px', 
              width: 'auto' 
            }}
          />
        </Link>

        {/* Content on the Right */}
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </nav>
  );
}
