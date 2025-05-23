import Articles from '@/components/articles';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Article',
  description: 'List of articles',
};

export default function ArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Articles />
    </Suspense>
  );
}
