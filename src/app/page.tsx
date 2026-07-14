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
  Layers,
  MessageCircle
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
    if (slug.includes('naval') || slug.includes('industrial')) return <Settings className="h-6 w-6 text-green-700" />;
    if (slug.includes('hogar') || slug.includes('minorista') || slug.includes('mayorista')) return <Home className="h-6 w-6 text-green-700" />;
    if (slug.includes('materia') || slug.includes('prima')) return <FlaskConical className="h-6 w-6 text-green-700" />;
    return <Layers className="h-6 w-6 text-green-700" />;
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@empresa.com';
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Buenos Aires, Argentina';
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER || 'empresa.clean';
  const landlinePhone = process.env.NEXT_PUBLIC_LANDLINE_PHONE || '0223 480-1234';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Visité tu sitio web y quería realizar una consulta.')}`;
  const instagramUrl = `https://instagram.com/${instagramUser}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white relative overflow-x-hidden pt-24">
      
      {/* Navigation Bar */}
      <nav className="border-b border-green-700 bg-green-600 fixed top-0 left-0 w-full z-40 shadow-md h-24 flex items-center">
        {/* Absolute Logo in top-left */}
        <Link href="/" className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 hover:opacity-90 transition-opacity z-50 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo_blanco_y_negro.png" 
            alt="Logo Tecnifer" 
            className="w-auto object-contain"
            style={{ height: '45px', width: 'auto' }}
          />
        </Link>

        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-end md:justify-between h-full">
          {/* Spacer to prevent overlapping with absolute logo on desktop */}
          <div className="hidden md:block w-48 lg:w-60 shrink-0 pointer-events-none" />
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#inicio" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Inicio</Link>
            <Link href="#categorias" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Categorías</Link>
            <Link href="#contacto" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Contacto</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-semibold px-4 py-2 border border-green-500 hover:border-white/60 hover:bg-green-500/20 rounded-xl transition-all text-white"
            >
              Admin
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 bg-white hover:bg-green-50 rounded-xl transition-all text-green-700 shadow-md active:scale-[0.98]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Ver Productos
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative max-w-7xl mx-auto px-6 pt-8 pb-10 md:pt-12 md:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Hero Image Container */}
        <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] overflow-hidden bg-white group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/30 via-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src="/landingimg.jpeg"
            alt="Soluciones de Limpieza Química"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>

        {/* Text and Title Container */}
        <div className="lg:col-span-7 space-y-6 text-center flex flex-col items-center justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide leading-[1.2] text-slate-900 font-oswald uppercase max-w-2xl lg:max-w-3xl mx-auto">
            Mas de 50 años acompañando a la industria
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-light">
            Comercializamos productos químicos para higiene y mantenimiento industrial, institucional y comercial, con alcance mayorista y minorista en Mar del Plata
          </p>

          {/* Quick trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-200 max-w-lg w-full">
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-slate-600 text-center">
              <ShieldCheck className="h-5 w-5 text-green-700 shrink-0" />
              <span>Garantía de Calidad</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-slate-600 text-center">
              <Truck className="h-5 w-5 text-green-700 shrink-0" />
              <span>Envíos a acordar</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-slate-600 text-center">
              <ShoppingBag className="h-5 w-5 text-green-700 shrink-0" />
              <span>Venta Mayorista</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section 
        id="categorias" 
        className="relative w-full shadow-inner"
        style={{ backgroundColor: '#e6f5dc', paddingTop: '100px', paddingBottom: '100px' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-wide font-oswald uppercase">
              Contamos con una amplia variedad de productos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href="/catalogo"
                className="group flex flex-col justify-between p-8 bg-white border border-slate-200 rounded-lg hover:border-green-700/40 hover:shadow-md transition-all duration-300 min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-md w-fit border border-slate-200 group-hover:bg-green-50 group-hover:border-green-200 transition-all">
                    {getCategoryIcon(category.slug)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-green-700 pt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <span>Ver productos</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 hover:border-slate-350 text-sm font-semibold rounded-md text-slate-700 transition-all hover:bg-slate-50"
            >
              <span>Ver todo el catálogo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section 
        id="contacto" 
        className="relative max-w-7xl mx-auto px-6"
        style={{ paddingTop: '35px', paddingBottom: '35px' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .contact-list-container {
              padding-right: 100px !important;
            }
            .contact-items-wrapper {
              margin-right: 120px !important;
            }
          }
        `}} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Map Column (Left) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4">
            <div className="w-full border border-slate-200 overflow-hidden shadow-sm" style={{ height: '370px' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.556575469522!2d-57.560982018966236!3d-38.0341158085819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584de7c2ad11acf%3A0xccab6b8a274c4704!2sTecnifer%20Productos%20Qu%C3%ADmicos!5e0!3m2!1ses-419!2sar!4v1783954580469!5m2!1ses-419!2sar" 
                style={{ border: 0, width: '100%', height: '370px' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <a 
              href="https://wa.me/5492233390404" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold transition-all hover:opacity-90 font-montserrat tracking-wider uppercase text-sm"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>Chateá con nosotros</span>
            </a>
          </div>

          <div className="lg:col-span-5 contact-list-container">
            <div 
              className="flex flex-col text-left"
              style={{ marginLeft: 'auto', width: 'fit-content' }}
            >
              <h2 
                className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-wide font-oswald uppercase"
                style={{ marginBottom: '35px' }}
              >
                Ponete en contacto
              </h2>
              
              <div className="flex flex-col gap-6 contact-items-wrapper">
                
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  className="flex items-center gap-4 hover:opacity-85 transition-opacity group"
                >
                  <div className="p-3 rounded-lg text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">WhatsApp</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{whatsappNumber}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Teléfono Fijo</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{landlinePhone}</p>
                  </div>
                </div>

                <Link
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-4 hover:opacity-85 transition-opacity group"
                >
                  <div className="p-3 rounded-lg text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Correo Electrónico</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{contactEmail}</p>
                  </div>
                </Link>

                <Link
                  href={instagramUrl}
                  target="_blank"
                  className="flex items-center gap-4 hover:opacity-85 transition-opacity group"
                >
                  <div className="p-3 rounded-lg text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Instagram</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">@{instagramUser}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer 
        className="max-w-7xl mx-auto px-6 border-t border-slate-200"
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          {/* Logo on the left */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative shrink-0" style={{ width: '80px', height: '80px' }}>
              <Image 
                src="/logo.png" 
                alt="Logo Tecnifer" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Centered copyright text */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Tecnifer. Todos los derechos reservados
            </p>
          </div>
          
          {/* Spacer to balance the layout */}
          <div className="hidden lg:block"></div>
        </div>
      </footer>

    </div>
  );
}
