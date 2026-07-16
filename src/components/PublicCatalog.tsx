'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderWrapper from './HeaderWrapper';
import { Search, ShoppingBag, ArrowRight, ArrowLeft, Settings, Home, FlaskConical, Layers } from 'lucide-react';
import { formatPresentation } from '@/lib/utils';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('categoria');

  const qParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(qParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);

  const categoryImages: Record<string, string> = {
    'naval-ndustrial': '/Fondo formulado 2.png',
    'hogar-mayorista-y-minorista': '/Fondo hogar.png',
    'linea-automotor': '/Fondo autos 2.png',
  };

  const categoryNameOverrides: Record<string, string> = {
    'naval-ndustrial': 'Naval Industrial',
    'hogar-mayorista-y-minorista': 'Hogar y Comercial',
    'linea-piscina': 'Línea Piscina',
    'linea-automotor': 'Línea Automotriz',
  };



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

  // Sort categories custom order (naval-ndustrial first, crunch-oil last)
  const sortedCategories = useMemo(() => {
    const order = [
      'naval-ndustrial',
      'hogar-mayorista-y-minorista',
      'linea-piscina',
      'linea-automotor',
      'materias-primas',
      'articulos-varios',
      'crunch-oil',
    ];
    return [...categories].sort((a, b) => {
      let indexA = order.indexOf(a.slug);
      let indexB = order.indexOf(b.slug);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      if (a.slug === 'crunch-oil') indexA = 1000;
      if (b.slug === 'crunch-oil') indexB = 1000;
      return indexA - indexB;
    });
  }, [categories]);

  // Client-side search and category filtering
  const filteredProducts = useMemo(() => {
    const filtered = initialProducts.filter(product => {
      const matchesCategory = selectedCategory 
        ? product.categorySlug === selectedCategory 
        : true;
        
      const matchesSearch = searchQuery.trim() === ''
        ? true
        : product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [initialProducts, selectedCategory, searchQuery]);

  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find(c => c.slug === selectedCategory) || null;
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white pb-20 relative overflow-x-hidden pt-[90px]">
      
      <HeaderWrapper>
        <Link
          href="/"
          className="text-xs font-semibold px-4 py-2 border border-green-500 hover:border-white/60 hover:bg-green-500/20 rounded-xl transition-all text-white"
        >
          Volver al Inicio
        </Link>
      </HeaderWrapper>

      {/* Hero / Header Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 tracking-wide font-oswald uppercase leading-[1.1]">
          {searchQuery 
            ? 'Resultados de Búsqueda' 
            : currentCategory 
              ? (categoryNameOverrides[currentCategory.slug] || currentCategory.name) 
              : 'Explorar por Categorías'}
        </h1>
        
        {searchQuery && (
          <p className="text-slate-600 mt-6 text-base md:text-lg max-w-xl leading-relaxed font-light">
            Mostrando productos que coinciden con "{searchQuery}"
          </p>
        )}

        {/* Search Bar */}
        <div className="w-full max-w-xl mt-10 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, detalles..."
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              const params = new URLSearchParams(window.location.search);
              if (val) {
                params.set('q', val);
              } else {
                params.delete('q');
              }
              router.replace(`/catalogo?${params.toString()}`, { scroll: false });
            }}
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all duration-200 shadow-sm"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-6">
        {/* If we are NOT searching and NO category is selected, show category grid */}
        {!selectedCategory && !searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
            {sortedCategories.map((category) => {
              const count = categoryCounts[category.slug] || 0;
              return (
                <Link
                  key={category.id}
                  href={`/catalogo?categoria=${category.slug}`}
                  className="group flex flex-col gap-3 w-full cursor-pointer text-center"
                >
                  {/* Cover photo placeholder box */}
                  <div className="w-full aspect-[4/3] bg-white border border-slate-200 rounded-lg group-hover:border-green-700/40 group-hover:shadow-md transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                    {categoryImages[category.slug] ? (
                      <Image
                        src={categoryImages[category.slug]}
                        alt={categoryNameOverrides[category.slug] || category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                        <div className="p-4 bg-white/80 rounded-full shadow-sm border border-slate-200 group-hover:scale-110 transition-transform">
                          {getCategoryIcon(category.slug)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Category name below the box in Oswald font */}
                  <span className="text-sm sm:text-base font-semibold font-oswald uppercase tracking-wider text-slate-900 group-hover:text-green-700 transition-colors text-center mt-1">
                    {categoryNameOverrides[category.slug] || category.name}
                  </span>
                </Link>
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
                  <Link
                    href="/catalogo"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
                  >
                    Volver a categorías
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in duration-300">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200/80 rounded-lg hover:border-green-700/40 hover:shadow-sm transition-all duration-300 gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-roboto font-light uppercase tracking-wider text-black text-lg leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {product.presentations && product.presentations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.presentations.map((p, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-none text-slate-600 font-semibold font-mono">
                            {formatPresentation(p, product)}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-roboto font-light uppercase tracking-wider text-black group-hover:underline shrink-0">
                      <span>Detalles</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform text-black" />
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
