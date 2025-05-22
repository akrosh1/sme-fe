'use client';

import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import useGlobalState from '@/hooks/useGlobalState';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { access } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    if (!access) {
      router.replace('/login');
    }
  }, [access, router]);

  if (!access) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <ScrollArea className="h-svh w-full overflow-hidden">
        <Header />
        <main className="flex-1 py-6 contenair mx-auto max-w-7xl px-4 sm:px-6 lg:px-8>">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
}
