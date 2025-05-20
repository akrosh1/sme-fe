'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCreateResource,
  useDeleteResource,
  useResourceList,
  useUpdateResource,
} from '@/hooks/useAPIManagement';
import { QueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { SearchInput } from '../common/searchComponent';
import { DataTable } from '../common/table';
import ActionMenu from '../common/table/actionMenu';
import TableSN from '../common/table/tableSN';

// Define interfaces
interface IPostResponse {
  total: number;
  count: number;
  results: Post[];
}

interface Post {
  id: string;
  name: string;
  is_active?: boolean;
  created_at?: string;
}

interface ModalState {
  type: 'delete' | 'add' | 'edit' | null;
  cmsId: string | null;
  open: boolean;
  roleData?: Post | null;
}

const DEFAULT_MODAL_STATE: ModalState = {
  type: null,
  cmsId: null,
  open: false,
  roleData: null,
};

const RolesList = () => {
  const [modalState, setModalState] = useState<ModalState>(DEFAULT_MODAL_STATE);
  const [roleName, setRoleName] = useState('');
  const queryClient = new QueryClient();
  const router = useRouter();

  const {
    data: cmsData,
    isLoading,
    error,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<IPostResponse>('user-groups', {
    defaultQuery: { pageIndex: 0, pageSize: 10, search: '' },
  });

  // const handleEdit = useCallback(
  //   (id: string) => {
  //     const roleToEdit = cmsData?.results.find((role) => role.id === id);
  //     if (roleToEdit) {
  //       setRoleName(roleToEdit.name);
  //       setModalState({
  //         type: 'edit',
  //         cmsId: id,
  //         open: true,
  //         roleData: roleToEdit,
  //       });
  //     }
  //   },
  //   [cmsData?.results],
  // );

  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', cmsId: id, open: true });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type !== 'delete' || !modalState.cmsId) return;
    try {
      deleteCMS({ id: modalState.cmsId });
    } catch (err) {
      console.error('Error deleting role:', err);
    }
  }, [modalState]);

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/roles/add-permission?id=${id}`);
    },
    [router],
  );

  const { mutate: deleteCMS, isPending: isDeleting } = useDeleteResource<Post>(
    `user-groups`,
    {
      onSuccess: () => {
        toast.success('Role deleted successfully');
        setModalState(DEFAULT_MODAL_STATE);
        queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete role');
      },
    },
  );

  const { mutate: createRole, isPending: isCreating } = useCreateResource<Post>(
    'user-groups',
    {
      onSuccess: () => {
        toast.success('Role created successfully');
        setModalState(DEFAULT_MODAL_STATE);
        setRoleName('');
        queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create role');
      },
    },
  );

  const { mutate: updateRole, isPending: isUpdating } = useUpdateResource<Post>(
    'user-groups',
    {
      onSuccess: () => {
        toast.success('Role updated successfully');
        setModalState(DEFAULT_MODAL_STATE);
        setRoleName('');
        queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update role');
      },
    },
  );

  const handleAddModalOpen = () => {
    setRoleName('');
    setModalState({ type: 'add', cmsId: null, open: true });
  };

  const handleModalClose = () => {
    setModalState(DEFAULT_MODAL_STATE);
    setRoleName('');
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (modalState.type === 'add') {
      createRole({ name: roleName });
    } else if (modalState.type === 'edit' && modalState.cmsId) {
      updateRole({
        id: modalState.cmsId,
        name: roleName,
      });
    }
  };

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 's.n.',
        header: 'S.N.',
        enableSorting: false,
        cell: ({ row }) => (
          <TableSN
            currentPage={+filters?.offset! + 1}
            pageSize={+filters?.limit!}
            index={row.index}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const cms = row.original;
          return (
            <ActionMenu
              actions={[
                {
                  label: 'Edit',
                  onClick: handleEdit,
                  variant: 'ghost',
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteClick,
                  variant: 'danger',
                },
              ]}
              id={cms.id}
            />
          );
        },
      },
    ],
    [filters?.limit, filters?.offset, handleDeleteClick, handleEdit],
  );

  const handleRowsPerPageChange = (pageSize: number | string) => {
    setFilters({ limit: Number(pageSize) });
    setFilters({ pageIndex: 0 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ pageIndex: page });
  };

  if (isLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (error) {
    return <div className="container py-10">Error: Something went wrong</div>;
  }

  return (
    <div className="container wrapper">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Roles List" />
        <Button onClick={handleAddModalOpen}>Add Role</Button>
      </div>

      <div className="flex justify-end mb-4">
        <SearchInput
          onChange={(value) => setFilters({ search: value })}
          placeholder="Search by name"
        />
      </div>

      <DataTable
        columns={columns}
        data={cmsData?.results || []}
        key={Math.random()}
        totalRows={cmsData?.count || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handleRowsPerPageChange}
        itemsPerPage={pageSize}
        currentPage={pageIndex + 1}
      />

      {/* Role Form Modal */}
      <Dialog
        open={modalState.type === 'add' || modalState.type === 'edit'}
        onOpenChange={handleModalClose}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {modalState.type === 'add' ? 'Add New Role' : 'Edit Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Role Name
              </Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="col-span-3"
                placeholder="Enter role name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={isCreating || isUpdating || !roleName.trim()}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={modalState.type === 'delete' && modalState.open}
        setOpen={handleModalClose}
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete Role',
          description:
            'Are you sure you want to delete this role? This action cannot be undone.',
        }}
      />
    </div>
  );
};

export default RolesList;
