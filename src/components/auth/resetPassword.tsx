'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateResource } from '@/hooks/useAPIManagement';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import resetPasswordImg from '../../../public/assets/resetPassword.svg';
import { FormElement } from '../common/form/formElement';

const resetPasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(8, 'Old password must be at least 8 characters')
      .max(50, 'Old password cannot exceed 50 characters'),
    password: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(50, 'New password cannot exceed 50 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;
interface ResetPasswordResponse {
  message: string;
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      old_password: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: resetPassword, isPending: isLoading } =
    useCreateResource<ResetPasswordResponse>('/auth/token/', {
      onSuccess: () => {
        toast.success('Password reset successfully!');
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error?.message || 'Invalid credentials. Please try again.');
      },
    });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }
    resetPassword(data);
  };

  // const onSubmit = async (data: ResetPasswordFormInputs) => {
  // if (!token) {
  //   toast.error('Invalid reset token');
  //   return;
  // }

  //   try {
  //     await resetPassword({
  //       token,
  //       old_password: data.old_password,
  //       password: data.password,
  //     }).unwrap();
  //     toast.success('Password reset successfully!');
  //     router.push('/login');
  //   } catch (error) {
  //     toast.error(
  //       error?.data?.error?.details ||
  //         'Failed to reset password. The link may have expired.',
  //     );
  //   }
  // };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl border-none">
        <CardContent className="grid md:grid-cols-2 p-0">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your new password
                  </p>
                </div>
                <FormElement
                  type="password"
                  name="old_password"
                  label="Old Password"
                />
                <FormElement
                  type="password"
                  name="password"
                  label="New Password"
                />
                <FormElement
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || isLoading}
                >
                  {form.formState.isSubmitting || isLoading
                    ? 'Resetting...'
                    : 'Reset Password'}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="relative hidden bg-muted md:block">
            <Image
              src={resetPasswordImg}
              alt="Reset password illustration"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
