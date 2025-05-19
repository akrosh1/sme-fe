// 'use client';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useResourceList } from '@/hooks/useAPIManagement';
// import { useMutation } from '@tanstack/react-query';
// import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { DataTableSkeleton } from '../common/skeleton/dataTableSkeleton';
// // import AddRolesPopup from '../components/CreateRoleModal';
// // import { PermissionCheckbox } from './PermissionCheckbox';

// interface Permission {
//   [key: string]: string;
// }

// interface PermissionGroup {
//   [key: string]: Permission[];
// }

// interface PermissionState {
//   [key: string]: {
//     [key: string]: number;
//   };
// }

// interface User {

// }

// const StaffPermissions = () => {
//   const [selectedStaff, setSelectedStaff] = useState<string>('');
//   const [permissions, setPermissions] = useState<PermissionGroup>({});
//   const [checkedPermissions, setCheckedPermissions] = useState<PermissionState>(
//     {},
//   );
//   const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);
//   const {
//     data: staffPermissionData,
//     total,
//     isLoading,
//     error,
//     filters,
//     setFilters,
//     pageIndex,
//     pageSize,
//   } = useResourceList<User>('user-permissions', {
//     defaultQuery: { pageIndex: 0, pageSize: 10 },
//   });
//   console.log(
//     '🚀 ~ StaffPermissions ~ staffPermissionData:',
//     staffPermissionData,
//   );

//   // const { data: rolesData } = useQuery({
//   //   queryKey: ['get-roles-data'],
//   //   queryFn: getPermissionRoles,
//   // });

//   // const {
//   //   data: staffPermissionData,
//   //   isLoading: isLoadingPermissions,
//   //   refetch: refetchPermission,
//   // } = useQuery({
//   //   queryKey: ['staff-permission'],
//   //   queryFn: () => getStaffPermission(selectedStaff),
//   //   enabled: !!selectedStaff,
//   // });

//   // const { data: getRolesData } = useQuery({
//   //   queryKey: ['staff-roles-permission'],
//   //   queryFn: () => getRolesPermission(selectedStaff),
//   //   enabled: !!selectedStaff,
//   // });

//   useEffect(() => {
//     if (
//       staffPermissionData &&
//       staffPermissionData.data &&
//       getRolesData &&
//       getRolesData.data
//     ) {
//       const rolePermissions = getRolesData.data.role[0].permissions;
//       const initialCheckedState: PermissionState = {};

//       // Initialize checkedPermissions based on staffPermissionData and rolesData
//       Object.entries(staffPermissionData.data).forEach(([category, perms]) => {
//         initialCheckedState[category] = {};
//         perms.forEach((perm: Permission) => {
//           const [id] = Object.keys(perm);
//           const permissionId = parseInt(id, 10);

//           // Check if the permission ID exists in rolesData and has status: 1
//           const isChecked = Object.values(rolePermissions).some(
//             (permGroup: any) =>
//               Object.values(permGroup).some(
//                 (permValue) =>
//                   permValue.id === permissionId && permValue.status === 1,
//               ),
//           );

//           initialCheckedState[category][id] = isChecked ? 1 : 0;
//         });
//       });

//       setCheckedPermissions(initialCheckedState);
//     }
//   }, [staffPermissionData, getRolesData]);

//   const updateMutation = useMutation({
//     mutationFn: (data: PermissionState) =>
//       updateStaffPermission({ permissions: data }, selectedStaff),
//     onSuccess: () => {
//       refetchPermission();
//       toast.success('Staff permissions have been successfully updated');
//     },
//     onError: (error) => {
//       toast.error('Failed to update staff permissions. Please try again');
//       console.error('Error updating permissions:', error);
//     },
//   });

//   const handleStaffSelect = (staffId: string) => {
//     setSelectedStaff(staffId);
//   };

//   const handlePermissionChange = (
//     category: string,
//     id: string,
//     checked: boolean,
//   ) => {
//     setCheckedPermissions((prev) => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [id]: checked ? 1 : 0,
//       },
//     }));
//   };

//   const handleSubmit = () => {
//     if (selectedStaff) {
//       updateMutation.mutate(checkedPermissions);
//     }
//   };

//   if (isLoadingPermissions) {
//     return (
//       <div className="flex flex-col gap-6 max-w-7xl mx-auto">
//         <Skeleton className="h-12 w-80" />
//         <Skeleton className="h-6 w-72" />
//         <DataTableSkeleton columns={5} rows={8} />
//       </div>
//     );
//   }

//   console.log(staffPermissionData?.data, 'kamallll');

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold mb-6">Dynamic Staff Permissions</h1>
//         <Button
//           variant="outline"
//           className="dark:bg-grey-700 dark:text-white"
//           onClick={() => setOpenCreateRoleModal(true)}
//         >
//           Create Roles
//         </Button>
//       </div>
//       <div className="mb-6 flex gap-2 items-center">
//         <h6 className="font-semibold text-grey-900">Staff</h6>
//         <SelectComponent
//           variant="outlined"
//           options={
//             rolesData?.data.map((staff: GetRolesDaum) => ({
//               label: staff.name as string,
//               value: staff.id.toString() as string,
//             })) || []
//           }
//           defaultValue={selectedStaff}
//           onValueChange={handleStaffSelect}
//         />
//       </div>

//       {updateMutation.isPending && (
//         <div className="text-blue-500">Updating permissions...</div>
//       )}

//       <div className="space-y-4 rounded-xl overflow-hidden border p-4">
//         {Object.entries(staffPermissionData?.data || {}).map(
//           ([category, perms]) => (
//             <PermissionCheckbox
//               key={category}
//               label={category}
//               permissions={perms}
//               checkedPermissions={checkedPermissions[category] || {}}
//               onChange={(id, checked) =>
//                 handlePermissionChange(category, id, checked)
//               }
//             />
//           ),
//         )}
//       </div>
//       <div className="mt-5 flex justify-center w-full">
//         <Button
//           onClick={handleSubmit}
//           disabled={updateMutation.isPending || !selectedStaff}
//         >
//           {updateMutation.isPending ? 'Updating...' : 'Submit Permissions'}
//         </Button>
//       </div>
//       {openCreateRoleModal && (
//         <AddRolesPopup
//           open={openCreateRoleModal}
//           setOpen={setOpenCreateRoleModal}
//         />
//       )}
//     </div>
//   );
// };

// export default StaffPermissions;

'use client';

// import {
//   PermissionCheckbox,
//   type Permission,
// } from '@/components/permission-checkbox';
// import { RoleSelector, type Role } from '@/components/role-selector';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, RefreshCw } from 'lucide-react';
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
    <div className="container mx-auto py-6 max-w-6xl">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Role Permissions</CardTitle>
              <CardDescription>
                Manage permissions for different roles in your organization
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleCreateRole}
              disabled={isCreatingRole}
              className="self-start md:self-auto"
            >
              {isCreatingRole ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Create Role
            </Button>
          </div>
        </CardHeader>

        <CardContent>
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
              {Object.entries(permissionGroups).map(
                ([category, permissions]) => (
                  <PermissionCheckbox
                    key={category}
                    label={category}
                    permissions={permissions}
                    checkedPermissions={checkedPermissions[category] || {}}
                    onChange={(id, checked) =>
                      handlePermissionChange(category, id, checked)
                    }
                  />
                ),
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-6">
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
        </CardFooter>
      </Card>
    </div>
  );
}
