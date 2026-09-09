'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import NavbarSearch from './NavbarSearch';

export default function MainNavbarNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex items-center" ref={mobileMenuRef}>
      {/* Desktop Navigation (completely untouched style & behavior) */}
      <div className="hidden md:flex items-center gap-8">
        <Link 
          href="#inicio" 
          className="text-base font-semibold text-green-100 hover:text-white transition-colors"
        >
          Inicio
        </Link>
        <Link 
          href="/catalogo" 
          className="text-[15px] font-semibold text-green-100 hover:text-white transition-colors"
        >
          Productos
        </Link>
        <Link 
          href="#contacto" 
          className="text-base font-semibold text-green-100 hover:text-white transition-colors"
        >
          Contacto
        </Link>
        <NavbarSearch />
      </div>

      {/* Mobile Navigation Controls */}
      <div className="flex md:hidden items-center gap-2">
        <NavbarSearch 
          onOpenChange={(open) => {
            if (open) setIsMobileMenuOpen(false);
          }} 
        />
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="text-green-100 hover:text-white p-1 rounded-md hover:bg-green-700/40 transition-colors flex items-center justify-center focus:outline-none"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-green-700 shadow-xl border-t border-green-600/60 px-6 py-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top-2 duration-200 z-50">
          <Link
            href="#inicio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-semibold text-green-100 hover:text-white py-2 border-b border-green-600/40 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-semibold text-green-100 hover:text-white py-2 border-b border-green-600/40 transition-colors"
          >
            Productos
          </Link>
          <Link
            href="#contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-semibold text-green-100 hover:text-white py-2 transition-colors"
          >
            Contacto
          </Link>
        </div>
      )}
    </div>
  );
}
