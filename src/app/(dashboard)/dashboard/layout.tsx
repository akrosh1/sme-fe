// 'use client';

// import { Header } from '@/components/common/Header';
// import { Sidebar } from '@/components/common/Sidebar';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { token } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!token) {
//       router.replace('/login');
//     }
//   }, [token, router]);

//   if (!token) {
//     return null;
//   }

//   return (
//     <div className="flex overflow-hidden">
//       <Sidebar />
//       <div className="flex-1">
//         <Header />
//         <main className="p-4">{children}</main>
//       </div>
//     </div>
//   );
// }

'use client';

import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
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
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <Header />
        <main className="flex-1  p-4">{children}</main>
      </div>
    </div>
  );
}
