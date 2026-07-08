'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // If already authenticated, redirect immediately
  if (data?.user) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <LoginForm />
    </main>
  );
}
