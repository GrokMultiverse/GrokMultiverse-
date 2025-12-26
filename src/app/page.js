"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('../components/DashboardContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-yellow-500 font-mono tracking-widest animate-pulse">
        CONNECTING TO MULTIVERSE...
      </div>
    </div>
  )
});

export default function Page() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <DashboardContent />;
    }
