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
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-20">
        <span className="font-bold tracking-wider text-indigo-400">CATÁLOGO ADMIN</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800 flex flex-col text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800 justify-between">
          <Link href="/admin" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">C</span>
            <span>Catálogo Admin</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-300"
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
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'hover:bg-slate-900 hover:text-white text-slate-400'
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
        <div className="p-4 border-t border-slate-900 bg-slate-950/60 space-y-3">
          {userEmail && (
            <div className="px-4 py-2 bg-slate-900/40 border border-slate-900 rounded-xl">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Usuario</p>
              <p className="text-xs text-slate-300 truncate font-medium mt-0.5">{userEmail}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver tienda pública
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-[0.98] w-full text-left"
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
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
