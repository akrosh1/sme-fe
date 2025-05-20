'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateResource } from '@/hooks/useAPIManagement';
import useGlobalState from '@/hooks/useGlobalState';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '@/store/slices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormElement } from '../common/form/formElement';

const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string().min(5, 'Password must be at least 6 characters').max(20),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginResponse {
  active_role: string;
  access: string;
  refresh: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setAccess } = useGlobalState();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending: isLoggingIn } =
    useCreateResource<LoginResponse>('/auth/token/', {
      onSuccess: (data) => {
        const { access, active_role, refresh: refreshToken } = data.data;
        dispatch(
          loginSuccess({
            token: access,
            refresh_token: refreshToken,
            active_role,
          }),
        );
        setAccess(access, refreshToken, active_role);
        toast.success('Login successful');
        router.push('/dashboard');
      },
      onError: (error) => {
        dispatch(loginFailure(error?.message || 'Failed to login'));
        toast.error(error?.message || 'Invalid credentials. Please try again.');
      },
    });

  const onSubmit = async (data: LoginFormInputs) => {
    dispatch(loginStart());
    login(data);
  };

  return (
    <div className="flex flex-col gap-6" {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl border-none">
        <CardContent className="grid md:grid-cols-2 p-0">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Acme Inc account
                  </p>
                </div>
                <FormElement type="email" name="email" label="Email" />
                <FormElement type="password" name="password" label="Password" />
                <a
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || isLoggingIn}
                >
                  {form.formState.isSubmitting || isLoggingIn
                    ? 'Logging in...'
                    : 'Login'}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </FormProvider>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/assets/signIn.svg"
              alt="Login illustration"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
