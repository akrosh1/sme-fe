import { ForgotPasswordForm } from '@/components/auth/forgotPassword';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </Suspense>
  );
}
