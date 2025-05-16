'use client';

import SelectComponent from '@/components/common/form/selectComponent';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateResource, useUpdateResource } from '@/hooks/useAPIManagement';
import useFetch from '@/hooks/useFetch';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const userRoles = ['ADMIN', 'EDITOR', 'USER'] as const;

export const userFormSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, 'Name must be at least 2 characters'),
  middle_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .optional(),
  last_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: z.enum(userRoles),
  is_active: z.union([z.boolean(), z.string()]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserRole = UserFormValues['role'];
export type UserStatus = UserFormValues['is_active'];

export function UserForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const { data: user, isLoading } = useFetch<
    'get',
    { id: string },
    UserFormValues
  >(`profiles/${userId}`, 'get', {
    enabled: !!userId,
    // @ts-expect-error fix later
    onError: (error: AxiosError) => {
      console.error(`Failed to fetch user with ID ${userId}:`, error?.message);
    },
    select: (data: { data: UserFormValues }) => data.data,
  });

  const initialValues: UserFormValues = {
    id: user?.id || 0,
    first_name: user?.first_name || '',
    middle_name: user?.middle_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: user?.password || '',
    role: user?.role || 'USER',
    is_active: user?.is_active ? 'true' : 'false',
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...initialValues,
      });
    }
  }, [user, form]);

  const { mutate: createUser, isPending: isCreating } =
    useCreateResource<UserFormValues>('profiles/', {
      onSuccess: () => {
        toast.success('User created successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create user');
      },
    });

  const { mutate: updateUser, isPending: isUpdating } =
    useUpdateResource<UserFormValues>(`profiles/${userId}`, {
      onSuccess: () => {
        toast.success('User updated successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update user');
      },
    });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (values: UserFormValues) => {
    const { id, role, is_active, ...data } = values;
    const transformedData = {
      ...data,
      password: values.password,
      is_active: is_active === 'true' ? true : false,
    };
    if (userId) {
      updateUser(transformedData);
    } else {
      createUser(transformedData);
    }
  };

  const handleCancelForm = () => {
    form.reset(initialValues);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 wrapper"
      >
        <PageHeader title="Users" actionText="Back" actionPath="/users" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl aria-autocomplete={'none'}>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <SelectComponent
                  options={[
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'EDITOR', label: 'Editor' },
                    { value: 'USER', label: 'User' },
                  ]}
                  placeholder="Select a role"
                  onValueChange={field.onChange}
                  value={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <SelectComponent
                  options={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
                  ]}
                  placeholder="Select status"
                  onValueChange={(value) => field.onChange(value === 'true')}
                  value={field.value ? 'true' : 'false'}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelForm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialValues.id ? 'Updating...' : 'Creating...'}
              </>
            ) : initialValues.id ? (
              'Update User'
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </form>
      <DevTool control={form.control} />;
    </Form>
  );
}
