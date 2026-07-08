import React from 'react';
import { getProducts, getCategories } from '@/lib/actions';
import PublicCatalog from '@/components/PublicCatalog';

export const revalidate = 3600; // Periodically revalidate every hour as a fallback

export default async function CatalogoPage() {
  const [productsList, categoriesList] = await Promise.all([
    getProducts({ onlyActive: true }),
    getCategories(),
  ]);

  return (
    <PublicCatalog 
      initialProducts={productsList} 
      categories={categoriesList} 
    />
  );
}
