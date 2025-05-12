import { ResetPasswordForm } from '@/components/auth/resetPassword';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}
