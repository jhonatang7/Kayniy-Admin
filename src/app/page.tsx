'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenClient } from '@/modules/auth/data/client/token_client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isTokenValid = TokenClient.validateToken();
    
    if (isTokenValid) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
