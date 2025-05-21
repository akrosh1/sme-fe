'use client';

import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCreateResource,
  useResourceList,
  useUpdateResource,
} from '@/hooks/useAPIManagement';
import { RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PermissionCheckbox } from './components/permissionCheckbox';

// Type definitions
interface IPermission {
  id: number;
  name: string;
  codename: string;
  content_type: string;
}

interface IPermissionGetResponse {
  id: number;
  name: string;
  permissions: number[];
}

interface PermissionGroup {
  [contentType: string]: {
    id: string;
    name: string;
    description?: string;
  }[];
}

interface PermissionState {
  [contentType: string]: Record<string, number>;
}

interface IPermissionResponse {
  name: string;
  permissions: number[];
}

const formSchema = z.object({
  name: z.string().max(60, 'Name must be at most 60 characters'),
  permissions: z.array(z.number()).optional(),
});

export default function StaffPermissions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleId = searchParams.get('id');
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup>({});
  const [checkedPermissions, setCheckedPermissions] = useState<PermissionState>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  // const [isUpdating, setIsUpdating] = useState(false);

  // Fetch permissions list
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useResourceList<{
      count: number;
      next: string | null;
      previous: string | null;
      results: IPermission[];
    }>('/permissions/', {
      defaultQuery: { pageIndex: 0, pageSize: 100, search: '' },
    });

  // Fetch role permissions
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } =
    useResourceList<IPermissionGetResponse>(
      roleId ? `/user-groups/${roleId}/` : '',
      { defaultQuery: { pageIndex: 0, pageSize: 100, search: '' } },
    );

  // Form setup
  const form = useForm<IPermissionResponse>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
    mode: 'onChange',
  });

  // Process permissions and initialize checked state
  useEffect(() => {
    if (!permissionsResponse?.results) return;

    // Group permissions by content_type
    const grouped = permissionsResponse.results.reduce((acc, permission) => {
      const [appLabel, modelName] = permission.content_type.split(' | ');
      const contentType = modelName || appLabel;

      if (!acc[contentType]) {
        acc[contentType] = [];
      }

      acc[contentType].push({
        id: permission.id.toString(),
        name: permission.name,
        description: `Code: ${permission.codename}`,
      });

      return acc;
    }, {} as PermissionGroup);

    setPermissionGroups(grouped);

    // Initialize checked permissions state
    const initialCheckedState: PermissionState = {};
    const rolePerms = rolePermissions?.permissions || [];

    Object.entries(grouped).forEach(([contentType, permissions]) => {
      initialCheckedState[contentType] = {};
      permissions.forEach((perm) => {
        initialCheckedState[contentType][perm.id] = rolePerms.includes(
          Number(perm.id),
        )
          ? 1
          : 0;
      });
    });

    setCheckedPermissions(initialCheckedState);

    // Initialize form values
    if (rolePermissions) {
      form.reset({
        name: rolePermissions.name,
        permissions: rolePermissions.permissions || [],
      });
    }

    setIsLoading(false);
  }, [permissionsResponse, rolePermissions, form]);

  // Handle permission checkbox changes
  const handlePermissionChange = (
    contentType: string,
    id: string,
    checked: boolean,
  ) => {
    setCheckedPermissions((prev) => ({
      ...prev,
      [contentType]: {
        ...prev[contentType],
        [id]: checked ? 1 : 0,
      },
    }));

    // Update form permissions
    const currentPermissions = form.getValues('permissions') || [];
    const permissionId = Number(id);

    if (checked) {
      if (!currentPermissions.includes(permissionId)) {
        form.setValue('permissions', [...currentPermissions, permissionId], {
          shouldDirty: true,
        });
      }
    } else {
      form.setValue(
        'permissions',
        currentPermissions.filter((p) => p !== permissionId),
        { shouldDirty: true },
      );
    }
  };

  // Handle form submission
  const { mutate: createRolePermissions, isPending: isCreating } =
    useCreateResource<IPermissionGetResponse>(
      roleId ? `/user-groups/${roleId}/` : '/user-groups/',
      {
        onSuccess: () => {
          toast.success(
            roleId
              ? 'Permissions updated successfully'
              : 'Role created successfully',
          );
          router.push('/roles');
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update permissions');
          // setIsUpdating(false);
        },
      },
    );

  const { mutate: updateRolePermissions, isPending: isUpdating } =
    useUpdateResource<IPermissionGetResponse>(
      roleId ? `/user-groups/${roleId}/` : '/user-groups/',
      {
        onSuccess: () => {
          toast.success(
            roleId
              ? 'Permissions updated successfully'
              : 'Role created successfully',
          );
          router.push('/roles');
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update permissions');
          // setIsUpdating(false);
        },
      },
    );

  const handleSubmit = form.handleSubmit((data) => {
    // setIsUpdating(true);
    const payload = {
      name: data.name,
      permissions: data.permissions || [],
    };
    if (roleId) {
      updateRolePermissions(payload);
    } else {
      createRolePermissions(payload);
    }
  });

  // Calculate loading state
  const isProcessing =
    isLoading ||
    isLoadingPermissions ||
    isLoadingRolePermissions ||
    isUpdating ||
    isCreating;

  return (
    <div className="container mx-auto py-6 max-w-6xl wrapper">
      <PageHeader
        title={roleId ? 'Edit Role Permissions' : 'Create New Role'}
        subTitle="Manage permissions for different roles in your organization"
        actionText="Back"
        actionPath="/roles"
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Role name"
            {...form.register('name')}
            className="w-full md:w-[300px]"
            disabled={isProcessing}
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {isProcessing ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            Object.entries(permissionGroups).map(
              ([contentType, permissions]) => (
                <PermissionCheckbox
                  key={contentType}
                  label={contentType}
                  permissions={permissions}
                  checkedPermissions={checkedPermissions[contentType] || {}}
                  onChange={(id, checked) =>
                    handlePermissionChange(contentType, id, checked)
                  }
                />
              ),
            )
          )}
        </div>

        <div className="flex justify-end border-t pt-6 mt-6">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {roleId ? 'Saving...' : 'Creating...'}
              </>
            ) : roleId ? (
              'Save Permissions'
            ) : (
              'Create Role'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
