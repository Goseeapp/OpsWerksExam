'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { api } from '@/lib/api';
import { getUser, setUser } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (getUser()) {
        router.push('/gadgets');
        return;
      }

      try {
        const me = await api.getMe();
        setUser(me);
        router.push('/gadgets');
      } catch {
        // No active session, stay on login page.
      }
    };

    checkSession();
  }, [router]);

  return <LoginForm />;
}
