import { ArticleForm } from '@/components/articles/form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add/Update Article',
  description: 'Add or update an article',
};

export default function ArticleFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleForm />
    </Suspense>
  );
}
