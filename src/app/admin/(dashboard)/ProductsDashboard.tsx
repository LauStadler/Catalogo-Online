'use client';

import React, { useState } from 'react';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '@/lib/actions';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  presentations: string[] | null;
  active: boolean;
  createdAt: Date;
  categoryId: string;
  categoryName: string | null;
  categorySlug: string | null;
}

interface ProductsDashboardProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsDashboard({ initialProducts, categories }: ProductsDashboardProps) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');

  
  // Overlay/Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [presentations, setPresentations] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [active, setActive] = useState(true);

  // UI status
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const openNewForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPresentations('');
    setCategoryId(categories[0]?.id || '');
    setActive(true);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPresentations(product.presentations ? product.presentations.join(', ') : '');
    setCategoryId(product.categoryId);
    setActive(product.active);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !categoryId) {
      showMessage('error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setMessage(null);

    const presentationsArray = presentations.split(',').map(p => p.trim()).filter(Boolean);

    try {
      if (editingProduct) {
        // Edit Action
        const res = await updateProduct(editingProduct.id, {
          name,
          description,
          presentations: presentationsArray,
          categoryId,
          active,
        });

        if (res.success && res.product) {
          const cat = categories.find(c => c.id === categoryId);
          const updated: Product = {
            ...(res.product as Product),
            categoryName: cat?.name || '',
            categorySlug: cat?.slug || '',
          };

          setProductsList(prev => 
            prev.map(p => p.id === editingProduct.id ? updated : p)
          );
          showMessage('success', 'Producto actualizado correctamente.');
          closeForm();
        } else {
          showMessage('error', res.error || 'Error al actualizar el producto.');
        }
      } else {
        // Create Action
        const res = await createProduct({
          name,
          description,
          presentations: presentationsArray,
          categoryId,
          active,
        });

        if (res.success && res.product) {
          const cat = categories.find(c => c.id === categoryId);
          const created: Product = {
            ...(res.product as Product),
            categoryName: cat?.name || '',
            categorySlug: cat?.slug || '',
          };

          setProductsList(prev => [created, ...prev]);
          showMessage('success', 'Producto creado con éxito.');
          closeForm();
        } else {
          showMessage('error', res.error || 'Error al crear el producto.');
        }
      }
    } catch {
      showMessage('error', 'Ocurrió un error inesperado al guardar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto de forma permanente?')) {
      return;
    }

    setDeleteLoadingId(id);
    setMessage(null);

    try {
      const res = await deleteProduct(id, slug);
      if (res.success) {
        setProductsList(prev => prev.filter(p => p.id !== id));
        showMessage('success', 'Producto eliminado de forma permanente.');
      } else {
        showMessage('error', res.error || 'Error al eliminar el producto.');
      }
    } catch {
      showMessage('error', 'Error al procesar la eliminación.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Filter products by search input
  const filteredProducts = productsList.filter(product => {
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      (product.categoryName || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          />
        </div>

        <button
          onClick={openNewForm}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Message Notifications */}
      {message && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200' 
            : 'bg-rose-500/10 border-rose-500/25 text-rose-200'
        } animate-in fade-in slide-in-from-top-1 duration-200`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Products Table/Grid */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="p-4 bg-slate-950/40 w-16 h-16 rounded-full flex items-center justify-center text-slate-600 mx-auto">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No se encontraron productos</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {search 
                  ? 'No hay productos que coincidan con los criterios de búsqueda.' 
                  : 'Empieza agregando un producto al catálogo usando el botón de arriba.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/20 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-5">Producto</th>
                  <th className="p-5">Categoría</th>
                  <th className="p-5">Estado</th>
                  <th className="p-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-900/10 transition-colors">
                    {/* Product Name & Image */}
                    <td className="p-5">
                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xs md:max-w-md">
                          {product.description}
                        </p>
                        {product.presentations && product.presentations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.presentations.map((p, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded font-medium border border-slate-850">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-5 text-sm text-slate-300">
                      {product.categoryName ? (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 text-xs font-medium">
                          {product.categoryName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600 italic">Sin categoría</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.active 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          product.active ? 'bg-emerald-400' : 'bg-slate-500'
                        }`} />
                        {product.active ? 'Activo' : 'Borrador'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/producto/${product.slug}`}
                          target="_blank"
                          className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Ver producto en la tienda"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Editar producto"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.slug)}
                          disabled={deleteLoadingId === product.id}
                          className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                          title="Eliminar producto"
                        >
                          {deleteLoadingId === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Drawer / Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={closeForm}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-20 px-6 border-b border-slate-800/60 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
              </h2>
              <button 
                onClick={closeForm}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Scrollable Area */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label htmlFor="prod-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nombre del Producto *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Remera Algodón Premium..."
                  className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label htmlFor="prod-cat" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Categoría *
                </label>
                {categories.length === 0 ? (
                  <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    No tienes categorías creadas. Ve a la sección de <Link href="/admin/categories" className="underline font-bold">Categorías</Link> para crear una primero.
                  </div>
                ) : (
                  <select
                    id="prod-cat"
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="prod-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Descripción *
                </label>
                <textarea
                  id="prod-desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe los detalles, talles, materiales del producto..."
                  className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Presentations */}
              <div className="space-y-2">
                <label htmlFor="prod-presentations" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Presentaciones (separadas por coma)
                </label>
                <input
                  id="prod-presentations"
                  type="text"
                  value={presentations}
                  onChange={(e) => setPresentations(e.target.value)}
                  placeholder="Ej: 250g, 500g, 1kg o Pack x6, Unidad"
                  className="block w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
                <p className="text-[10px] text-slate-500">
                  Ingresa las diferentes presentaciones de este producto separadas por comas.
                </p>
              </div>


              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-850 rounded-xl">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-slate-350">
                    Producto Activo / Visible
                  </label>
                  <p className="text-xs text-slate-500">
                    Si está inactivo, no se mostrará en el catálogo público.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded border-slate-850 bg-slate-950/40 focus:ring-indigo-500"
                />
              </div>
            </form>

            {/* Footer buttons */}
            <div className="h-20 px-6 border-t border-slate-800/60 flex items-center justify-end gap-3 shrink-0 bg-slate-950/20">
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || categories.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
