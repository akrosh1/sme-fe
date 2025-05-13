import UserManagement from '@/components/users';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Users',
  description: 'List of users',
};

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <div className="min-h-screen flex items-center justify-center"> */}
      <UserManagement />
      {/* </div> */}
    </Suspense>
  );
}
