'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateResource, useUpdateResource } from '@/hooks/useAPIManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const userRoles = ['ADMIN', 'EDITOR', 'USER'] as const;
export const userStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;

export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(userRoles),
  status: z.enum(userStatuses),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserRole = UserFormValues['role'];
export type UserStatus = UserFormValues['status'];

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({
  defaultValues,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const initialValues = {
    id: '',
    name: '',
    email: '',
    role: 'USER' as const,
    status: 'ACTIVE' as const,
    ...defaultValues,
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { mutate: createUser, isPending: isCreating } =
    useCreateResource<UserFormValues>('users', {
      onSuccess: () => {
        toast.success('User created successfully');
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create user');
      },
    });

  const { mutate: updateUser, isPending: isUpdating } =
    useUpdateResource<UserFormValues>(`users/${initialValues.id}`, {
      onSuccess: () => {
        toast.success('User updated successfully');
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update user');
      },
    });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (values: UserFormValues) => {
    if (values.id) {
      updateUser(values);
    } else {
      createUser(values);
    }
  };

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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
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
    </Form>
  );
}
