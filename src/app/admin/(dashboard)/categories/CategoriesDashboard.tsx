'use client';

import React, { useState } from 'react';
import { 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/lib/actions';
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

interface CategoriesDashboardProps {
  initialCategories: Category[];
}

export default function CategoriesDashboard({ initialCategories }: CategoriesDashboardProps) {
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (editingId) {
        // Update Action
        const res = await updateCategory(editingId, { name, description });
        if (res.success && res.category) {
          setCategoriesList(prev => 
            prev.map(c => c.id === editingId ? (res.category as Category) : c)
          );
          showMessage('success', 'Categoría actualizada correctamente.');
          handleCancelEdit();
        } else {
          showMessage('error', res.error || 'Error al actualizar la categoría.');
        }
      } else {
        // Create Action
        const res = await createCategory({ name, description });
        if (res.success && res.category) {
          setCategoriesList(prev => [res.category as Category, ...prev]);
          showMessage('success', 'Categoría creada con éxito.');
          setName('');
          setDescription('');
        } else {
          showMessage('error', res.error || 'Error al crear la categoría.');
        }
      }
    } catch {
      showMessage('error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría? Todos los productos asociados serán afectados.')) {
      return;
    }

    setDeleteLoadingId(id);
    setMessage(null);

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategoriesList(prev => prev.filter(c => c.id !== id));
        showMessage('success', 'Categoría eliminada correctamente.');
        if (editingId === id) {
          handleCancelEdit();
        }
      } else {
        showMessage('error', res.error || 'Error al eliminar la categoría.');
      }
    } catch {
      showMessage('error', 'Error al eliminar la categoría.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
      {/* List Column */}
      <div className="xl:col-span-2 space-y-4">
        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
              : 'bg-rose-50 border-rose-250 text-rose-800'
          } animate-in fade-in slide-in-from-top-1 duration-200`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Listado de Categorías</h2>
          </div>
          
          {categoriesList.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No hay categorías creadas todavía. Usa el formulario para crear la primera.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categoriesList.map((category) => (
                <div 
                  key={category.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 transition-all duration-200 hover:bg-slate-50 ${
                    editingId === category.id ? 'bg-emerald-50/50 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-base">{category.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono">
                        {category.slug}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-slate-550 max-w-xl leading-relaxed">{category.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-650 hover:text-slate-900 transition-colors"
                      title="Editar categoría"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteLoadingId === category.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-650 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar categoría"
                    >
                      {deleteLoadingId === category.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Column */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          {editingId && (
            <button 
              onClick={handleCancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="cat-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nombre de la Categoría
            </label>
            <input
              id="cat-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Naval Industrial, Hogar..."
              className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cat-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Descripción (Opcional)
            </label>
            <textarea
              id="cat-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla de qué trata esta categoría..."
              className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 resize-none shadow-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-550 disabled:bg-emerald-700/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/10 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : editingId ? (
                <Pencil className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Guardando...' : editingId ? 'Actualizar Categoría' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
