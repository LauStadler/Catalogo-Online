import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />
      
      <div className="z-10 space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-indigo-500 tracking-tighter animate-pulse">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Producto o página no encontrada</h2>
          <p className="text-sm text-slate-400">
            El enlace que has seguido es inválido, el producto no existe o ha sido dado de baja por el administrador.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
