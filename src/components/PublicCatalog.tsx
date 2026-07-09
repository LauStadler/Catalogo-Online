'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight, ArrowLeft, Settings, Home, FlaskConical, Layers } from 'lucide-react';

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

  // Helper to map category names to icons
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('naval') || slug.includes('industrial')) return <Settings className="h-6 w-6 text-emerald-600" />;
    if (slug.includes('hogar') || slug.includes('minorista') || slug.includes('mayorista')) return <Home className="h-6 w-6 text-emerald-600" />;
    if (slug.includes('materia') || slug.includes('prima')) return <FlaskConical className="h-6 w-6 text-emerald-600" />;
    return <Layers className="h-6 w-6 text-emerald-600" />;
  };

  // Count active products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach(product => {
      if (product.categorySlug && product.active) {
        counts[product.categorySlug] = (counts[product.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts]);

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

  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find(c => c.slug === selectedCategory) || null;
  }, [categories, selectedCategory]);

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

      {/* Hero / Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center text-center">
        {selectedCategory && !searchQuery && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver a Categorías
          </button>
        )}

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] text-slate-900">
          {searchQuery 
            ? 'Resultados de Búsqueda' 
            : currentCategory 
              ? currentCategory.name 
              : 'Explorar por Categorías'}
        </h1>
        
        <p className="text-slate-600 mt-6 text-base md:text-lg max-w-xl leading-relaxed font-light">
          {searchQuery 
            ? `Mostrando productos que coinciden con "${searchQuery}"` 
            : currentCategory 
              ? (currentCategory.description || 'Navega por los productos de esta categoría y realiza tu pedido por WhatsApp.') 
              : 'Selecciona una categoría para descubrir sus productos y presentaciones disponibles.'}
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-6">
        {/* If we are NOT searching and NO category is selected, show category grid */}
        {!selectedCategory && !searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
            {categories.map((category) => {
              const count = categoryCounts[category.slug] || 0;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="group flex flex-col justify-between p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 min-h-[220px] text-left cursor-pointer"
                >
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 bg-slate-50 rounded-2xl w-fit border border-slate-200 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                        {getCategoryIcon(category.slug)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 pt-4 group-hover:translate-x-1 transition-all">
                    <span>Explorar productos</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Otherwise (searching or category selected), show products grid */
          filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-white w-16 h-16 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-200 shadow-sm">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">No hay productos que mostrar</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  No encontramos productos que coincidan con tu búsqueda o categoría seleccionada.
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    Volver a categorías
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in duration-300">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-500/30 hover:shadow-md transition-all duration-300 gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                      {product.categoryName && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700">
                          {product.categoryName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-655 line-clamp-2 md:line-clamp-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {product.presentations && product.presentations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.presentations.map((p, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:underline shrink-0">
                      <span>Detalles</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
