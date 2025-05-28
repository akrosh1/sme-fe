'use client';

import { FormElement } from '@/components/common/form/formElement';
import { FormButtonGroup } from '@/components/common/form/submitButton';
import PageHeader from '@/components/common/PageHeader';
import { Form } from '@/components/ui/form';
import {
  useCreateResource,
  useResourceList,
  useUpdateResource,
} from '@/hooks/useAPIManagement';
import useFetch from '@/hooks/useFetch';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const userFormSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, 'Name must be at least 2 characters'),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters')
    .optional(),
  role: z.array(z.string()),
  is_active: z.union([z.boolean(), z.string()]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface ICMSGetResponse {
  results: [
    {
      id: number;
      name: string;
    },
  ];
}

export function UserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdFromParams = searchParams.get('userId');
  const [userId, setUserId] = useState<string | null>(userIdFromParams);

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

  const { data: cmsData, isLoading: isLoadingCms } =
    useResourceList<ICMSGetResponse>('user-groups', {
      defaultQuery: { pageSize: 1000 },
    });

  const rolesNames = cmsData?.results.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  }));

  const initialValues: UserFormValues = {
    id: user?.id || 0,
    first_name: user?.first_name || '',
    middle_name: user?.middle_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: user?.password || '',
    role: user?.role || [],
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

  const {
    mutate: createUser,
    isPending: isCreating,
    data: createdUserData,
  } = useCreateResource<UserFormValues>('profiles/', {
    onSuccess: (data) => {
      toast.success('User created successfully');
      setUserId(data?.data?.id?.toString() as string);
      router.push(`/users`);
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create user');
    },
  });

  const { mutate: updateUser, isPending: isUpdating } =
    useUpdateResource<UserFormValues>(`profiles/${userId}`, {
      onSuccess: () => {
        toast.success('User updated successfully');
        router.push(`/users?userId=${userId}`);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update user');
      },
    });

  const { mutate: updateUserRoles, isPending: isUpdatingRoles } =
    useUpdateResource<UserFormValues>(`user-group-assignments/${userId}`, {
      onSuccess: () => {
        toast.success('User roles updated successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update user roles');
      },
    });

  const isSubmitting = isCreating || isUpdating || isUpdatingRoles;

  const onSubmit = (values: UserFormValues) => {
    const { id, role, is_active, ...data } = values;
    const transformedData = {
      ...data,
      password: values.password,
      is_active: is_active === 'true' ? true : false,
    };

    if (userId) {
      // Update existing user
      updateUser(transformedData);
      updateUserRoles({ email: user?.email, groups: role });
    } else {
      // Create new user
      createUser(transformedData, {
        onSuccess: (data) => {
          if (!data) return;
          updateUserRoles({ email: values.email, groups: role });
        },
      });
    }
  };

  const handleCancelForm = () => {
    form.reset(initialValues);
  };

  if (isLoading || isLoadingCms) {
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
          <FormElement type="text" name="first_name" label="First Name" />
          <FormElement type="text" name="middle_name" label="Middle Name" />
          <FormElement type="text" name="last_name" label="Last Name" />
          <FormElement type="email" name="email" label="Email" />
          <FormElement type="password" name="password" label="Password" />
          <FormElement
            name="role"
            type="multiSelect"
            className="w-full"
            label="Roles"
            value={form.getValues('role') || []}
            options={rolesNames || []}
            placeholder="Select roles..."
          />
          <FormElement
            type="select"
            name="is_active"
            className="w-full"
            label="Status"
            value={user?.is_active ? 'true' : 'false'}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-4">
          <FormButtonGroup
            isSubmitting={isSubmitting}
            mode={userId ? 'edit' : 'create'}
            cancel={{
              onClick: handleCancelForm,
              text: 'Discard Changes',
            }}
            submitText={{
              create: 'Create user',
              edit: 'Update user',
            }}
            submitLoadingText={{
              create: 'Creating user...',
              edit: 'Updating user...',
            }}
          />
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}
