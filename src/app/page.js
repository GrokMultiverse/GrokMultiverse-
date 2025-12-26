"use client";
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PhaseConfig, SOCIALS } from "../utils/PhaseConfig";

// Load components only on the client side to prevent SSR errors
const DashboardContent = dynamic(() => import('../components/DashboardContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-yellow-500 animate-pulse uppercase tracking-widest">Initialising Multiverse...</p>
    </div>
  )
});

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
