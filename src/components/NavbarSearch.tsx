'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when search bar is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the clicked element was detached from the DOM during render (e.g. SVG icon swap),
      // do not treat it as an outside click.
      if (event.target && !document.body.contains(event.target as Node)) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {/* Main trigger button (Lupa) */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="text-green-100 hover:text-white transition-all duration-200 hover:scale-105 p-1 rounded-full hover:bg-green-700/30 cursor-pointer flex items-center justify-center z-55"
        title={isOpen ? "Cerrar búsqueda" : "Buscar productos"}
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Floating Search Input Container */}
      {isOpen && (
        <form 
          onSubmit={handleSubmit}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute right-0 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md z-50 flex items-center gap-2 animate-in fade-in duration-200"
          style={{ width: 'calc(100vw - 32px)', maxWidth: '380px', top: '100%', marginTop: '12px' }}
        >
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Buscar productos químicos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-slate-800 text-xs placeholder-slate-400 outline-none w-full py-0.5 font-sans"
          />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
            className="text-slate-400 hover:text-slate-650 transition-colors p-1 ml-1 cursor-pointer shrink-0"
            title="Cerrar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
