import React from 'react';
import { getProducts, getCategories } from '@/lib/actions';
import ProductsDashboard from './ProductsDashboard';

export const revalidate = 0; // Disable static cache for admin dashboards

export default async function AdminDashboard() {
  const [productsList, categoriesList] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Productos</h1>
        <p className="text-slate-400 mt-1">
          Crea, edita y da de baja los productos de tu catálogo.
        </p>
      </div>

      <ProductsDashboard 
        initialProducts={productsList} 
        categories={categoriesList} 
      />
    </div>
  );
}
