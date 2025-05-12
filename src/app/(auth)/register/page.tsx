import { RegisterForm } from '@/components/auth/registerForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register to your account',
};
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
