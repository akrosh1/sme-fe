import { UserForm } from '@/components/users/add-update';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'User Add/Update',
  description: 'Add or update a user',
};

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserForm />
    </Suspense>
  );
}
