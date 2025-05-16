// @ts-nocheck
'use client';

import {
  getPermissionRoles,
  getRolesPermission,
  getStaffPermission,
  updateStaffPermission,
} from '@/apis/setting';
import { DataTableSkeleton } from '@/components/loading/DataTableLoading';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SelectComponent from '@/stories/Select';
import { GetRolesDaum } from '@/types/settings';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import AddRolesPopup from '../components/CreateRoleModal';
import { PermissionCheckbox } from './PermissionCheckbox';

interface Permission {
  [key: string]: string;
}

interface PermissionGroup {
  [key: string]: Permission[];
}

interface PermissionState {
  [key: string]: {
    [key: string]: number;
  };
}

const StaffPermissions = () => {
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [permissions, setPermissions] = useState<PermissionGroup>({});
  const [checkedPermissions, setCheckedPermissions] = useState<PermissionState>(
    {},
  );
  const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);

  const { data: rolesData } = useQuery({
    queryKey: ['get-roles-data'],
    queryFn: getPermissionRoles,
  });

  const {
    data: staffPermissionData,
    isLoading: isLoadingPermissions,
    refetch: refetchPermission,
  } = useQuery({
    queryKey: ['staff-permission'],
    queryFn: () => getStaffPermission(selectedStaff),
    enabled: !!selectedStaff,
  });

  const { data: getRolesData } = useQuery({
    queryKey: ['staff-roles-permission'],
    queryFn: () => getRolesPermission(selectedStaff),
    enabled: !!selectedStaff,
  });

  useEffect(() => {
    if (
      staffPermissionData &&
      staffPermissionData.data &&
      getRolesData &&
      getRolesData.data
    ) {
      const rolePermissions = getRolesData.data.role[0].permissions;
      const initialCheckedState: PermissionState = {};

      // Initialize checkedPermissions based on staffPermissionData and rolesData
      Object.entries(staffPermissionData.data).forEach(([category, perms]) => {
        initialCheckedState[category] = {};
        perms.forEach((perm: Permission) => {
          const [id] = Object.keys(perm);
          const permissionId = parseInt(id, 10);

          // Check if the permission ID exists in rolesData and has status: 1
          const isChecked = Object.values(rolePermissions).some(
            (permGroup: any) =>
              Object.values(permGroup).some(
                (permValue) =>
                  permValue.id === permissionId && permValue.status === 1,
              ),
          );

          initialCheckedState[category][id] = isChecked ? 1 : 0;
        });
      });

      setCheckedPermissions(initialCheckedState);
    }
  }, [staffPermissionData, getRolesData]);

  const updateMutation = useMutation({
    mutationFn: (data: PermissionState) =>
      updateStaffPermission({ permissions: data }, selectedStaff),
    onSuccess: () => {
      refetchPermission();
      toast.success('Staff permissions have been successfully updated');
    },
    onError: (error) => {
      toast.error('Failed to update staff permissions. Please try again');
      console.error('Error updating permissions:', error);
    },
  });

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff(staffId);
  };

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

  const handleSubmit = () => {
    if (selectedStaff) {
      updateMutation.mutate(checkedPermissions);
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-6 w-72" />
        <DataTableSkeleton columns={5} rows={8} />
      </div>
    );
  }

  console.log(staffPermissionData?.data, 'kamallll');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Dynamic Staff Permissions</h1>
        <Button
          variant="outline"
          className="dark:bg-grey-700 dark:text-white"
          onClick={() => setOpenCreateRoleModal(true)}
        >
          Create Roles
        </Button>
      </div>
      <div className="mb-6 flex gap-2 items-center">
        <h6 className="font-semibold text-grey-900">Staff</h6>
        <SelectComponent
          variant="outlined"
          options={
            rolesData?.data.map((staff: GetRolesDaum) => ({
              label: staff.name as string,
              value: staff.id.toString() as string,
            })) || []
          }
          defaultValue={selectedStaff}
          onValueChange={handleStaffSelect}
        />
      </div>

      {updateMutation.isPending && (
        <div className="text-blue-500">Updating permissions...</div>
      )}

      <div className="space-y-4 rounded-xl overflow-hidden border p-4">
        {Object.entries(staffPermissionData?.data || {}).map(
          ([category, perms]) => (
            <PermissionCheckbox
              key={category}
              label={category}
              permissions={perms}
              checkedPermissions={checkedPermissions[category] || {}}
              onChange={(id, checked) =>
                handlePermissionChange(category, id, checked)
              }
            />
          ),
        )}
      </div>
      <div className="mt-5 flex justify-center w-full">
        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending || !selectedStaff}
        >
          {updateMutation.isPending ? 'Updating...' : 'Submit Permissions'}
        </Button>
      </div>
      {openCreateRoleModal && (
        <AddRolesPopup
          open={openCreateRoleModal}
          setOpen={setOpenCreateRoleModal}
        />
      )}
    </div>
  );
};

export default StaffPermissions;
