import type { Metadata } from 'next';
import { Archivo, Geist_Mono, Montserrat, Oswald, Roboto } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tecnifer - Catálogo de Productos Online',
  description: 'Explora nuestro catálogo de productos, filtra por categorías y realiza pedidos directamente por WhatsApp de forma rápida y sencilla.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5492233390404';
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Visité tu sitio web y quería realizar una consulta.')}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${montserrat.variable} ${oswald.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans relative">
        {children}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Chatear por WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-white group-hover:scale-105 transition-transform"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.79 14.12c-.27.75-1.56 1.37-2.15 1.46-.5.08-1.15.15-3.35-.76-2.82-1.17-4.64-4.04-4.78-4.23-.14-.19-1.12-1.49-1.12-2.84 0-1.35.7-2.01.95-2.28.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.4.01.62.53.23.53.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.16.16-.33.34-.14.67.19.33.84 1.39 1.8 2.25.96.86 1.77 1.13 2.1 1.3.33.17.52.12.72-.1.2-.23.86-.99 1.09-1.33.23-.34.46-.29.77-.18.31.11 1.99.94 2.33 1.11.34.17.57.25.65.39.08.14.08.82-.19 1.57z" />
          </svg>
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
            Chateá con nosotros
          </span>
        </a>
      </body>
    </html>
  );
}
