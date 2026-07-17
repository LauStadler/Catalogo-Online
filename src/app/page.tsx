import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/actions';
import HeaderWrapper from '@/components/HeaderWrapper';
import NavbarSearch from '@/components/NavbarSearch';
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
  MessageCircle,
  Clock,
  Car,
  Waves
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

  const desiredSlugs = ['naval-ndustrial', 'hogar-mayorista-y-minorista', 'linea-piscina', 'linea-automotor'];
  
  const landingCategories = desiredSlugs
    .map(slug => categories.find(c => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => !!c);

  const categoryNameOverrides: Record<string, string> = {
    'naval-ndustrial': 'Naval Industrial',
    'hogar-mayorista-y-minorista': 'Hogar y Comercial',
    'linea-piscina': 'Línea Piscina',
    'linea-automotor': 'Línea Automotriz',
  };

  const categoryImages: Record<string, string> = {
    'naval-ndustrial': '/Fondo formulado 2.png',
    'hogar-mayorista-y-minorista': '/Fondo hogar.png',
    'linea-automotor': '/Fondo autos 2.png',
  };

  // Helper to map category names to icons
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('automotor') || slug.includes('automotriz')) return <Car className="h-6 w-6 text-green-700" />;
    if (slug.includes('piscina') || slug.includes('pileta')) return <Waves className="h-6 w-6 text-green-700" />;
    if (slug.includes('hogar') || slug.includes('minorista') || slug.includes('mayorista')) return <Home className="h-6 w-6 text-green-700" />;
    if (slug.includes('formulados') || slug.includes('materia') || slug.includes('prima')) return <FlaskConical className="h-6 w-6 text-green-700" />;
    return <Layers className="h-6 w-6 text-green-700" />;
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5492233390404';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'ventas@tecniferproductos.com.ar';
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Cerrito 467, Mar del Plata, Provincia de Buenos Aires';
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USER || 'tecniferproductos';
  const landlinePhone = process.env.NEXT_PUBLIC_LANDLINE_PHONE || '0223 480-1904';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Visité tu sitio web y quería realizar una consulta.')}`;
  const instagramUrl = `https://instagram.com/${instagramUser}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white relative overflow-x-hidden pt-[90px]">
      
      <HeaderWrapper>
        <div className="flex items-center gap-8 h-full">
          <div className="hidden md:flex items-center gap-8">
            <Link href="#inicio" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Inicio</Link>
            <Link href="/catalogo" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Catálogo</Link>
            <Link href="#contacto" className="text-sm font-semibold text-green-100 hover:text-white transition-colors">Contacto</Link>
            <NavbarSearch />
          </div>
        </div>
      </HeaderWrapper>

      {/* Hero Section */}
      <section id="inicio" className="relative w-full bg-white z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Image Container */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[9/10] overflow-hidden bg-white border border-slate-200 shadow-sm group">
            <Image
              src="/landingimg_original.jpeg"
              alt="Soluciones de Limpieza Química"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: 'center 59.4%' }}
              priority
            />
          </div>

          {/* Text and Title Container */}
          <div className="lg:col-span-7 space-y-8 text-center flex flex-col items-center justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide leading-[1.2] text-slate-900 font-oswald uppercase max-w-2xl lg:max-w-3xl mx-auto">
              Más de 50 años acompañando a la industria
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-light">
              Desde 1973 nos dedicamos a la formulación y distribución de productos químicos de higiene y mantenimiento para el sector naval, industrial y comercial.
            </p>
          </div>
        </div>
      </section>

      {/* Secondary Info Section (Reversed Layout) */}
      <section className="relative w-full bg-white pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text and Title Container (Left on Desktop) */}
          <div className="lg:col-span-7 space-y-8 text-center flex flex-col items-center justify-center order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide leading-[1.2] text-slate-900 font-oswald uppercase max-w-2xl lg:max-w-3xl mx-auto">
              Soluciones eficaces para cada necesidad
            </h2>
            
            <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-light">
              Elaboramos y distribuimos una completa línea de artículos de limpieza y productos químicos. Brindamos asesoramiento personalizado, ventas de forma minorista y mayorista, y logística a medida para comercios, instituciones y los sectores naval e industrial.
            </p>
          </div>

          {/* Image Container (Right on Desktop) */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[9/10] overflow-hidden bg-white border border-slate-200 shadow-sm group order-1 lg:order-2">
            <Image
              src="/partner_cropped.jpeg"
              alt="Productos Químicos y Limpieza Profesional"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
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

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {landingCategories.map((category) => (
              <Link
                key={category.id}
                href={`/catalogo?categoria=${category.slug}`}
                className="group flex flex-col gap-3"
              >
                {/* Cover photo placeholder box */}
                <div className="w-full aspect-[4/3] bg-white border border-slate-200 rounded-lg group-hover:border-green-700/40 group-hover:shadow-md transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                  {categoryImages[category.slug] ? (
                    <Image
                      src={categoryImages[category.slug]}
                      alt={categoryNameOverrides[category.slug] || category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : null}
                </div>
                
                {/* Category name below the box in Oswald font */}
                <span className="text-sm sm:text-base font-semibold font-oswald uppercase tracking-wider text-slate-900 group-hover:text-green-700 transition-colors text-center mt-1">
                  {categoryNameOverrides[category.slug] || category.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 hover:border-slate-350 text-sm font-semibold rounded-md text-slate-700 transition-all hover:bg-slate-50"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section 
        id="contacto" 
        className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Map Column (Left) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4">
            <div className="relative w-full border border-slate-200 bg-white overflow-hidden shadow-sm h-[300px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.556575469522!2d-57.560982018966236!3d-38.0341158085819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584de7c2ad11acf%3A0xccab6b8a274c4704!2sTecnifer%20Productos%20Qu%C3%ADmicos!5e0!3m2!1ses-419!2sar!4v1783954580469!5m2!1ses-419!2sar" 
                style={{ border: 0, width: '100%', height: '100%' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="text-xs text-slate-850 font-mono">
              Cerrito 467, Mar del Plata, Provincia de Buenos Aires
            </p>
          </div>

          {/* Contact Details Column (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center pb-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-wide font-oswald uppercase">
                Canales de Atención
              </h2>
            </div>

            <div className="flex flex-col border-t border-slate-200">
              {/* Correo Electrónico */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4.5 w-4.5 text-black shrink-0" />
                  <span className="text-xs font-roboto font-light uppercase tracking-wider text-black">Ventas / Presupuestos</span>
                </div>
                <span className="text-sm font-roboto font-light tracking-wider text-black break-all lowercase">{contactEmail}</span>
              </div>

              {/* Teléfono Fijo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-4.5 w-4.5 text-black shrink-0" />
                  <span className="text-xs font-roboto font-light uppercase tracking-wider text-black">Administración / Tel. Fijo</span>
                </div>
                <span className="text-sm font-roboto font-light uppercase tracking-wider text-black">{landlinePhone}</span>
              </div>

              {/* Instagram */}
              <a 
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-200 gap-2 hover:bg-slate-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="h-4.5 w-4.5 text-black group-hover:text-green-600 transition-colors shrink-0" />
                  <span className="text-xs font-roboto font-light uppercase tracking-wider text-black group-hover:text-green-600 transition-colors">Redes Sociales / Instagram</span>
                </div>
                <span className="text-sm font-roboto font-light tracking-wider text-black group-hover:text-green-600 transition-colors lowercase">@{instagramUser}</span>
              </a>

              {/* Horarios */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-4.5 w-4.5 text-black shrink-0" />
                  <span className="text-xs font-roboto font-light uppercase tracking-wider text-black">Horario de Atención</span>
                </div>
                <div className="text-left sm:text-right text-sm font-roboto font-light tracking-wider text-black space-y-1">
                  <p><span className="text-black">Lun a Vie:</span> 08:00 - 12:30 hs</p>
                  <p><span className="text-black">y de:</span> 13:30 - 17:00 hs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer 
        className="max-w-7xl mx-auto px-6 border-t border-slate-200 text-center"
        style={{ paddingTop: '24px', paddingBottom: '24px' }}
      >
        <p className="text-xs text-slate-500 font-mono">
          © {new Date().getFullYear()} Tecnifer. Todos los derechos reservados
        </p>
      </footer>

    </div>
  );
}
