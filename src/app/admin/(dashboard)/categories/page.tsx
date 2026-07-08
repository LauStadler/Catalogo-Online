import React from 'react';
import { getCategories } from '@/lib/actions';
import CategoriesDashboard from './CategoriesDashboard';

export const revalidate = 0; // Disable static cache for admin dashboards

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Categorías</h1>
        <p className="text-slate-600 mt-1">
          Administra las categorías de tus productos para facilitar la navegación y filtros.
        </p>
      </div>

      <CategoriesDashboard initialCategories={categories} />
    </div>
  );
}
