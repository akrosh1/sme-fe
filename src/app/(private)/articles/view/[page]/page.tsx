import ViewArticle from '@/components/articles/view';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CMS',
  description: 'Content Management System',
};

export default function ViewArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewArticle />
    </Suspense>
  );
}
