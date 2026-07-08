import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Safeguard check, although middleware handles this
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 antialiased">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto h-screen relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <div className="flex-1 p-6 lg:p-10 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
