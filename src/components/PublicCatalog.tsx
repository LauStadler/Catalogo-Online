'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  presentations: string[] | null;
  active: boolean;
  categoryName: string | null;
  categorySlug: string | null;
}

interface PublicCatalogProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function PublicCatalog({ initialProducts, categories }: PublicCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side search and category filtering
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesCategory = selectedCategory 
        ? product.categorySlug === selectedCategory 
        : true;
        
      const matchesSearch = searchQuery.trim() === ''
        ? true
        : product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white pb-20 relative overflow-hidden">
      
      {/* Background Decor Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Nav bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Logo Tecnifer" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-750 bg-clip-text text-transparent font-extrabold tracking-wide">Tecnifer</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl transition-all text-slate-655 hover:text-slate-900"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          Catálogo Online de Productos
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] text-slate-900">
          Descubre Nuestro Listado de Productos
        </h1>
        
        <p className="text-slate-600 mt-6 text-base md:text-lg max-w-xl leading-relaxed">
          Navega por nuestras categorías, encuentra lo que buscas y realiza tu pedido directamente por WhatsApp de forma instantánea.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-xl mt-10 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, detalles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 shadow-md"
          />
        </div>
      </section>

      {/* Filter Categories pills */}
      <section className="max-w-7xl mx-auto px-6 py-6 border-y border-slate-200 my-8">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Todos
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                selectedCategory === category.slug
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="p-4 bg-white w-16 h-16 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-200 shadow-sm">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No hay productos que mostrar</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No encontramos productos en esta categoría o que coincidan con tu búsqueda.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/producto/${product.slug}`}
                className="group flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 p-6 justify-between gap-4 min-h-[180px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {product.categoryName && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700">
                        {product.categoryName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-550 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  {product.presentations && product.presentations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.presentations.map((p, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 group-hover:text-emerald-600 transition-colors font-medium">
                    Ver detalles
                  </span>
                  <span className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 group-hover:text-white group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
