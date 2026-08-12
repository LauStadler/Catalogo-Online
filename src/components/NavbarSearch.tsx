'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { getProducts } from '@/lib/actions';

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Debounced search for products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const products = await getProducts({ search: query.trim(), onlyActive: true });
        setResults(products.slice(0, 5));
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250); // 250ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

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
        <Search className="h-5 w-5" />
      </button>

      {/* Floating Search Input & Results Dropdown Container */}
      {isOpen && (
        <div 
          className="absolute right-0 bg-white border border-slate-200 rounded-none shadow-md z-50 flex flex-col animate-in fade-in duration-200 overflow-hidden"
          style={{ width: 'calc(100vw - 32px)', maxWidth: '380px', top: '100%', marginTop: '12px' }}
        >
          <form 
            onSubmit={handleSubmit}
            onMouseDown={(e) => e.stopPropagation()}
            className="px-3 py-2 flex items-center gap-2 border-b border-slate-100"
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Buscar productos químicos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-slate-800 text-xs placeholder-slate-400 outline-none w-full py-0.5 font-roboto font-light tracking-wide"
            />
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-650 transition-colors p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Results List */}
          {query.trim() !== '' && (
            <div className="flex flex-col py-1 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-3 text-xs text-slate-400 text-center font-roboto font-light uppercase tracking-wider">
                  Buscando coincidencias...
                </div>
              ) : results.length > 0 ? (
                <>
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        router.push(`/producto/${product.slug}`);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="px-4 py-2.5 text-left hover:bg-slate-50 flex items-center transition-colors cursor-pointer border-none bg-transparent rounded-none"
                    >
                      <span className="text-xs font-roboto font-light uppercase tracking-wider text-slate-900 line-clamp-1">
                        {product.name}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="px-4 py-2.5 text-center text-[10px] font-bold text-black hover:bg-slate-50 border-t border-slate-100 transition-colors uppercase tracking-wider font-mono cursor-pointer rounded-none"
                  >
                    Ver todos los resultados
                  </button>
                </>
              ) : (
                <div className="px-4 py-3 text-xs text-slate-500 text-center font-roboto font-light uppercase tracking-wider">
                  No se encontraron coincidencias
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
