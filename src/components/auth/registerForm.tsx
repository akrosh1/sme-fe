'use client';

import { useRegisterMutation } from '@/api/auth/authApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import registerImg from '../../../public/assets/signup.svg';

interface SignUpFormInputs {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [signUp, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  console.log('🚀 ~ getValues:', getValues);

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const res = await signUp(data).unwrap();
      console.log('🚀 ~ onSubmit ~ res:', res);
      toast.success('Registered in successfully!');
      router.push('/login');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 md:w-3xl">
        <CardContent className="grid md:grid-cols-2 p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your details below to get started
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first_name">Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  {...register('first_name', { required: true })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">First Name is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Name</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  {...register('last_name', { required: true })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">Last Name is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">Email is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">Password is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', { required: true })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    Confirm Passwordis required
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
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
