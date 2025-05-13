'use client';

import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-[calc(100vh)] overflow-hidden">
        <Header />
        <main className="flex-1 p-4 pb-10>">{children}</main>
      </div>
    </div>
  );
}
