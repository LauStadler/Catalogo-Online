"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl: string;
  className?: string;
  label?: string;
}

export default function BackButton({ fallbackUrl, className, label = 'Volver' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className || "flex items-center gap-2 text-xs font-semibold text-green-100 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
