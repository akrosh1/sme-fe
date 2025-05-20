'use client';

import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Permission,
  PermissionCheckbox,
} from './components/permissionCheckbox';
import { Role, RoleSelector } from './components/roleSelector';

// Type definitions
interface PermissionGroup {
  [key: string]: Permission[];
}

interface PermissionState {
  [key: string]: Record<string, number>;
}

// Mock API functions (replace with your actual API calls)
const fetchRoles = async (): Promise<Role[]> => {
  // Simulate API call
  return [
    { id: '1', name: 'Administrator' },
    { id: '2', name: 'Editor' },
    { id: '3', name: 'Viewer' },
  ];
};

const fetchPermissions = async (roleId: string): Promise<PermissionGroup> => {
  // Simulate API call
  return {
    'User Management': [
      {
        id: '1',
        name: 'Create Users',
        description: 'Ability to create new user accounts',
      },
      {
        id: '2',
        name: 'Edit Users',
        description: 'Ability to modify existing user accounts',
      },
      {
        id: '3',
        name: 'Delete Users',
        description: 'Ability to remove user accounts from the system',
      },
      {
        id: '4',
        name: 'View Users',
        description: 'Ability to view user account details',
      },
    ],
    'Content Management': [
      {
        id: '5',
        name: 'Create Content',
        description: 'Ability to create new content',
      },
      {
        id: '6',
        name: 'Edit Content',
        description: 'Ability to modify existing content',
      },
      {
        id: '7',
        name: 'Delete Content',
        description: 'Ability to remove content from the system',
      },
      {
        id: '8',
        name: 'Publish Content',
        description: 'Ability to make content publicly visible',
      },
    ],
    'System Settings': [
      {
        id: '9',
        name: 'View Settings',
        description: 'Ability to view system settings',
      },
      {
        id: '10',
        name: 'Modify Settings',
        description: 'Ability to change system settings',
      },
      {
        id: '11',
        name: 'Manage Backups',
        description: 'Ability to create and restore system backups',
      },
    ],
  };
};

const fetchRolePermissions = async (
  roleId: string,
): Promise<Record<string, number>> => {
  // Simulate API call
  if (roleId === '1') {
    // Administrator
    return {
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
      '6': 1,
      '7': 1,
      '8': 1,
      '9': 1,
      '10': 1,
      '11': 1,
    };
  } else if (roleId === '2') {
    // Editor
    return {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 1,
      '5': 1,
      '6': 1,
      '7': 0,
      '8': 1,
      '9': 1,
      '10': 0,
      '11': 0,
    };
  } else {
    // Viewer
    return {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 1,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 1,
      '10': 0,
      '11': 0,
    };
  }
};

const updateRolePermissions = async (
  roleId: string,
  permissions: PermissionState,
): Promise<void> => {
  // Simulate API call
  console.log('Updating permissions for role', roleId, permissions);
  // In a real app, you would send this data to your API
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function StaffPermissions() {
  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup>({});
  const [checkedPermissions, setCheckedPermissions] = useState<PermissionState>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load roles on component mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0].id);
        }
      } catch (error) {
        console.error('Error loading roles:', error);
        toast.error('Failed to load roles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, [toast]);

  // Load permissions when a role is selected
  useEffect(() => {
    if (!selectedRole) return;

    const loadPermissions = async () => {
      setIsLoading(true);
      try {
        // Load permission structure
        const permissionsData = await fetchPermissions(selectedRole);
        setPermissionGroups(permissionsData);

        // Load role's current permissions
        const rolePermissions = await fetchRolePermissions(selectedRole);

        // Initialize checked permissions state
        const initialCheckedState: PermissionState = {};

        Object.entries(permissionsData).forEach(([category, permissions]) => {
          initialCheckedState[category] = {};
          permissions.forEach((perm) => {
            initialCheckedState[category][perm.id] =
              rolePermissions[perm.id] || 0;
          });
        });

        setCheckedPermissions(initialCheckedState);
      } catch (error) {
        console.error('Error loading permissions:', error);
        toast('Failed to load permissions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [selectedRole, toast]);

  // Handle role selection
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
  };

  // Handle permission change
  const handlePermissionChange = (
    category: string,
    id: string,
    checked: boolean,
  ) => {
    setCheckedPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: checked ? 1 : 0,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedRole) {
      setIsUpdating(true);
      try {
        await updateRolePermissions(selectedRole, checkedPermissions);
        toast('Permissions have been updated successfully.');
      } catch (error) {
        console.error('Error updating permissions:', error);
        toast('Failed to update permissions. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handle create role
  const handleCreateRole = () => {
    setIsCreatingRole(true);
    // In a real app, you would show a modal or navigate to a create role page
    toast('This would open a modal to create a new role.');
    setTimeout(() => setIsCreatingRole(false), 1000);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl wrapper">
      <PageHeader
        title="Role Permissions"
        subTitle="Manage permissions for different roles in your organization"
        actionText="Back"
        actionPath="/roles"
      />
      <div>
        <div className="mb-6">
          <RoleSelector
            roles={roles}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(permissionGroups).map(([category, permissions]) => (
              <PermissionCheckbox
                key={category}
                label={category}
                permissions={permissions}
                checkedPermissions={checkedPermissions[category] || {}}
                onChange={(id, checked) =>
                  handlePermissionChange(category, id, checked)
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || isLoading || !selectedRole}
        >
          {isUpdating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Permissions'
          )}
        </Button>
      </div>
    </div>
  );
}
