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
      {/* Search Input Container - Absolute positioned to float next to the icon without pushing layout */}
      {isOpen && (
        <form 
          onSubmit={handleSubmit}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute right-8 flex items-center bg-white border border-slate-200 rounded-none px-3 py-1.5 animate-in fade-in slide-in-from-right-4 duration-200 shadow-md z-50 min-w-[180px] sm:min-w-[240px]"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-slate-800 text-xs placeholder-slate-400 outline-none w-full py-0.5"
          />
          <button 
            type="submit"
            className="text-slate-500 hover:text-green-700 transition-colors p-0.5 ml-1 cursor-pointer shrink-0"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>
      )}

      {/* Main trigger button (Lupa / X) */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            setQuery('');
          } else {
            setIsOpen(true);
          }
        }}
        className="text-green-100 hover:text-white transition-all duration-200 hover:scale-105 p-1 rounded-full hover:bg-green-700/30 cursor-pointer flex items-center justify-center z-55"
        title={isOpen ? "Cerrar búsqueda" : "Buscar productos"}
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
