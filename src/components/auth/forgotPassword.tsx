'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateResource } from '@/hooks/useAPIManagement';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import forgotPasswordImg from '../../../public/assets/ForgotPassword.svg';
import { FormElement } from '../common/form/formElement';

const forgotpasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotpasswordSchema>;

interface forgotPasswordResponse {
  email: string;
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotpasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: forgotPassword, isPending: isLoggingIn } =
    useCreateResource<forgotPasswordResponse>('/auth/token/', {
      onSuccess: () => {
        toast.success('Login successful');
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error?.message || 'Invalid credentials. Please try again.');
      },
    });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    forgotPassword(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl">
        <CardContent className="grid md:grid-cols-2 p-0">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to receive a reset link
                  </p>
                </div>
                <FormElement type="email" name="email" label="Email" />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Sending...'
                    : 'Send Reset Link'}
                </Button>

                <div className="text-center text-sm">
                  Remember your password?{' '}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </div>
              </div>
            </form>
          </FormProvider>

          <div className="relative hidden bg-muted md:block">
            <img
              src={forgotPasswordImg.src}
              alt="Forgot password illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
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
