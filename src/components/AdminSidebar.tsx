'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  ShoppingBag, 
  Layers, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    {
      name: 'Productos',
      href: '/admin',
      icon: ShoppingBag,
      exact: true
    },
    {
      name: 'Categorías',
      href: '/admin/categories',
      icon: Layers,
      exact: false
    }
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 text-slate-850 sticky top-0 z-20">
        <span className="font-bold tracking-wider text-emerald-600">TECNIFER ADMIN</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col text-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-slate-200 justify-between">
          <Link href="/admin" className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Logo Tecnifer" 
                className="w-full h-full object-contain"
              />
            </div>
            <span>Tecnifer Admin</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-650"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                  ${active 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                    : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area with Profile and Logout */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 space-y-3">
          {userEmail && (
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Usuario</p>
              <p className="text-xs text-slate-700 truncate font-medium mt-0.5">{userEmail}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver tienda pública
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all active:scale-[0.98] w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
