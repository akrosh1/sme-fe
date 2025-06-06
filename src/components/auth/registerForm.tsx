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
import registerImg from '../../../public/assets/signup.svg';
import { FormElement } from '../common/form/formElement';

const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

interface SignUPResponse {
  active_role: string;
  access: string;
  refresh: string;
}

type SignUpFormInputs = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const form = useForm<SignUpFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: signUP, isPending: isCreating } =
    useCreateResource<SignUPResponse>('/profiles/', {
      onSuccess: () => {
        toast.success('Registration successful');
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error?.message || 'Registration failed. Please try again.');
      },
    });

  const onSubmit = async (data: SignUpFormInputs) => {
    signUP(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl border-none">
        <CardContent className="grid md:grid-cols-2 p-0">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create an account</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your details below to get started
                  </p>
                </div>
                <FormElement type="text" name="first_name" label="First Name" />

                <FormElement type="text" name="last_name" label="Last Name" />
                <FormElement type="email" name="email" label="Email" />
                <FormElement type="password" name="password" label="Password" />
                <FormElement
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || isCreating}
                >
                  {form.formState.isSubmitting || isCreating
                    ? 'Registering...'
                    : 'Register'}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="relative hidden bg-muted md:block">
            <img
              src={registerImg.src}
              alt="Register"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
