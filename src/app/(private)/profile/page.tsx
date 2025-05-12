import { ProfileForm } from '@/components/profile';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
