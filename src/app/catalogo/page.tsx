import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/actions';
import PublicCatalog from '@/components/PublicCatalog';

export const revalidate = 3600; // Periodically revalidate every hour as a fallback

export default async function CatalogoPage() {
  const [productsList, categoriesList] = await Promise.all([
    getProducts({ onlyActive: true }),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-mono">Cargando catálogo...</div>}>
      <PublicCatalog 
        initialProducts={productsList} 
        categories={categoriesList} 
      />
    </Suspense>
  );
}
