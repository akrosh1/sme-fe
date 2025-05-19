import ContentForm from '@/components/cms/form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Users',
  description: 'List of users',
};

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentForm />
    </Suspense>
  );
}
