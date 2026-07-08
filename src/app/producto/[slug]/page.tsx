import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/actions';
import { ArrowLeft, MessageSquare, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic SEO & Open Graph Metadata
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Producto No Encontrado',
    };
  }

  const title = `${product.name} | Catálogo Online`;
  const description = `${product.description.substring(0, 150)}...`;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/producto/${product.slug}`,
      siteName: 'Catálogo de Productos',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

// Enable Static Site Generation (SSG) for all existing products during build
export async function generateStaticParams() {
  const products = await getProducts({ onlyActive: true });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // If product doesn't exist or is not active, throw a 404
  if (!product || !product.active) {
    notFound();
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const productUrl = `${siteUrl}/producto/${product.slug}`;
  
  // Format the WhatsApp pre-filled message
  const presentationsStr = product.presentations && product.presentations.length > 0 
    ? `\n*📦 Presentaciones:* ${product.presentations.join(', ')}` 
    : '';
  const textMessage = `Hola! Me interesa este producto de tu catálogo:\n\n*🛍️ ${product.name}*${presentationsStr}\n*🔗 Enlace:* ${productUrl}\n\n¿Tienen stock disponible?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white pb-20 relative overflow-hidden">
      
      {/* Background Decor Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Logo Tecnifer" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span>Tecnifer</span>
          </Link>
          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Catálogo
          </Link>
        </div>
      </nav>

      {/* Main product view */}
      <main className="max-w-3xl mx-auto px-6 pt-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-8 shadow-xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle decor line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
          
          {/* Category and Title */}
          <div className="space-y-4">
            {product.categoryName && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700">
                {product.categoryName}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>


          {/* Presentations */}
          {product.presentations && product.presentations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Presentaciones Disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {product.presentations.map((p, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Detalles del Producto</h3>
            <p className="text-base text-slate-650 leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>
          </div>

          {/* WhatsApp CTA Button */}
          <div className="pt-4 space-y-3">
            <Link
              href={whatsappUrl}
              target="_blank"
              className="relative flex items-center justify-center gap-3 px-8 py-4.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all duration-200 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 group overflow-hidden"
            >
              {/* Pulse Glow Effect */}
              <span className="absolute inset-0 bg-emerald-450/10 rounded-2xl animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <MessageSquare className="h-6 w-6 shrink-0" />
              <span className="text-base tracking-wide">Hacer Pedido por WhatsApp</span>
            </Link>
            <p className="text-center text-xs text-slate-500">
              Serás redirigido para enviar un mensaje con los datos del producto automáticamente.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-center">
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <Truck className="h-5 w-5 text-emerald-600" />
              <p className="text-[10px] font-bold text-slate-600">Envíos a acordar</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <p className="text-[10px] font-bold text-slate-600">Compra segura</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <RefreshCw className="h-5 w-5 text-emerald-600" />
              <p className="text-[10px] font-bold text-slate-600">Garantía directa</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
