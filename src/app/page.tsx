import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/actions';
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  Truck, 
  FlaskConical, 
  Home, 
  Layers
} from 'lucide-react';

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const revalidate = 3600;

export default async function LandingPage() {
  const categories = await getCategories();

  // Helper to map category names to icons
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('naval') || slug.includes('industrial')) return <Settings className="h-6 w-6 text-emerald-600" />;
    if (slug.includes('hogar') || slug.includes('minorista') || slug.includes('mayorista')) return <Home className="h-6 w-6 text-emerald-600" />;
    if (slug.includes('materia') || slug.includes('prima')) return <FlaskConical className="h-6 w-6 text-emerald-600" />;
    return <Layers className="h-6 w-6 text-emerald-600" />;
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@empresa.com';
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Buenos Aires, Argentina';
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER || 'empresa.clean';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Visité tu sitio web y quería realizar una consulta.')}`;
  const instagramUrl = `https://instagram.com/${instagramUser}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white pb-10 relative overflow-hidden">
      
      {/* Background Decor Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="relative w-16 h-16 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo Tecnifer" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-slate-900 font-extrabold tracking-wide">Tecnifer</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#inicio" className="text-sm font-medium text-slate-650 hover:text-emerald-600 transition-colors">Inicio</Link>
            <Link href="#categorias" className="text-sm font-medium text-slate-655 hover:text-emerald-600 transition-colors">Categorías</Link>
            <Link href="#contacto" className="text-sm font-medium text-slate-655 hover:text-emerald-600 transition-colors">Contacto</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-semibold px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900"
            >
              Admin
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all text-white shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Ver Productos
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            Química & Soluciones de Limpieza Profesional
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Soluciones Químicas y de Limpieza de <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Alta Gama</span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
            Fabricamos y distribuimos productos químicos industriales, artículos de limpieza para el hogar, envases y materias primas premium. Todo nuestro catálogo disponible al instante para pedidos por WhatsApp.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-emerald-600 hover:bg-emerald-550 active:scale-[0.98] transition-all duration-200 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/10 group"
            >
              <span>Explorar Productos</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contacto"
              className="inline-flex items-center justify-center px-7 py-4 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 active:scale-[0.98] transition-all text-slate-600 hover:text-slate-900 font-bold rounded-2xl"
            >
              Contactar Ventas
            </Link>
          </div>

          {/* Quick trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Garantía de Calidad</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Truck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Envíos a acordar</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <ShoppingBag className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Venta Mayorista</span>
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/30 via-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src="/landingimg.jpeg"
            alt="Soluciones de Limpieza Química"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Accent glow behind image */}
          <div className="absolute inset-0 border border-emerald-500/10 rounded-3xl z-20 pointer-events-none group-hover:border-emerald-500/20 transition-colors" />
        </div>
      </section>

      {/* Categories Grid Section */}
      <section id="categorias" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explora por Categorías
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-light leading-relaxed">
            Contamos con soluciones específicas para cada necesidad. Selecciona una categoría para ver todos los productos disponibles y sus presentaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href="/catalogo"
              className="group flex flex-col justify-between p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 min-h-[220px]"
            >
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl w-fit border border-slate-200 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                  {getCategoryIcon(category.slug)}
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 pt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <span>Ver productos</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 hover:border-slate-350 text-sm font-semibold rounded-2xl text-slate-700 transition-all hover:bg-slate-50"
          >
            <span>Ver Todo el Catálogo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ponete en Contacto
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-light leading-relaxed">
              ¿Tenés dudas sobre concentraciones, necesitás presupuestos mayoristas o querés hacer un pedido a medida? Escribinos por cualquiera de nuestros canales de atención.
            </p>
            <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0">
                  <Image 
                    src="/logo.png" 
                    alt="Logo Tecnifer" 
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-800">Tecnifer</h4>
                  <p className="text-[10px] text-slate-500">Distribución Mayorista y Minorista</p>
                </div>
              </div>
              <p className="text-xs text-slate-550 leading-relaxed">
                Respondemos consultas técnicas de productos y coordinamos entregas de forma inmediata vía WhatsApp.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Phone/WhatsApp Card */}
            <Link
              href={whatsappUrl}
              target="_blank"
              className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Teléfono / WhatsApp</h4>
                <p className="text-xs text-slate-500">Comunícate directamente</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1 group-hover:underline">Enviar mensaje</p>
              </div>
            </Link>

            {/* Email Card */}
            <Link
              href={`mailto:${contactEmail}`}
              className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Correo Electrónico</h4>
                <p className="text-xs text-slate-500">Presupuestos y consultas</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1 group-hover:underline">{contactEmail}</p>
              </div>
            </Link>

            {/* Location Card */}
            <div className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Ubicación</h4>
                <p className="text-xs text-slate-500">Envíos a todo el país</p>
                <p className="text-xs text-slate-650 font-semibold mt-1">{contactAddress}</p>
              </div>
            </div>

            {/* Instagram Card */}
            <Link
              href={instagramUrl}
              target="_blank"
              className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Instagram</h4>
                <p className="text-xs text-slate-500">Seguinos para novedades</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1 group-hover:underline">@{instagramUser}</p>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-16 pb-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-4">
        <p>© {new Date().getFullYear()} Tecnifer. Todos los derechos reservados.</p>
        <p className="font-light">Diseñado con enfoque sustentable e industrial.</p>
      </footer>

    </div>
  );
}
