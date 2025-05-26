import CategoriesList from '@/components/categories';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'List of categories',
};

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesList />
    </Suspense>
  );
}
