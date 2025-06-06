import { MultiStepForm } from '@/components/complete-profile';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Complete Profile',
  description: 'Complete your profile',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiStepForm />
    </Suspense>
  );
}
