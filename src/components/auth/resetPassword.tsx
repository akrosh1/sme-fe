'use client';

import { useResetPasswordMutation } from '@/api/auth/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import resetPasswordImg from '../../../public/assets/resetPassword.svg';

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{
    old_password: string;
    password: string;
    confirmPassword: string;
  }>();

  const onSubmit = async (data: { password: string; old_password: string }) => {
    // if (!token) {
    //   toast.error('Invalid reset token');
    //   return;
    // }

    try {
      await resetPassword({
        old_passworsd: data.old_password,
        password: data.password,
      }).unwrap();
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error) {
      toast.error(
        error?.data?.error?.details ||
          ' Failed to reset password. The link may have expired.',
      );
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl">
        <CardContent className="grid md:grid-cols-2 p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your new password
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="old_password">Old Password</Label>
                <Input
                  id="old_password"
                  type="old_password"
                  {...register('old_password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                {errors.old_password && (
                  <p className="text-sm text-red-500">
                    {errors.old_password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={resetPasswordImg.src}
              alt="Reset password illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
