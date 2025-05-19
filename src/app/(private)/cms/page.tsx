import CMSList from '@/components/cms';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CMS',
  description: 'Content Management System',
};

export default function CMSPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CMSList />
    </Suspense>
  );
}
