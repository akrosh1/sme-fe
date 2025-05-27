'use client';

import { useResourceList } from '@/hooks/useAPIManagement';
import { IResponse } from '@/interface/api/api.interface';
import capitalize from '@/utils/capitalizeTextCase';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { DataTable } from '../common/table';
import ActionMenu from '../common/table/actionMenu';
import { Badge } from '../ui/badge';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  active_role: string;
  gender: string;
  createdAt: string;
}

const UsersTable = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState({
    type: null as 'delete' | null,
    userId: null as string | null,
    open: false,
  });

  const {
    data: users,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<IResponse<User[]>>('profiles', {
    defaultQuery: { pageIndex: 0, pageSize: 10 },
  });
  console.log(
    '🚀 ~ UsersTable ~     error>>>>',
    total,
    filters,
    pageIndex,
    pageSize,
  );

  // const debouncedFilterChange = setFilters((prev: any) => ({
  //   ...prev,
  //   pageIndex: 0,
  // }));

  const userData = useMemo(
    () =>
      users?.results?.map((user: User) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        active_role: user.active_role,
        gender: user.gender,
        createdAt: user.createdAt,
      })) || [],
    [users],
  );

  const handleEdit = useCallback(
    (id: string) => router.push(`/users/add-update?userId=${id}`),
    [router],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', userId: id, open: true });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type === 'delete' && modalState.userId) {
      try {
        console.log('Deleting user:', modalState.userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setModalState({ type: null, userId: null, open: false });
      }
    }
  }, [modalState]);

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        header: 'S.N.',
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => capitalize(row.getValue('name')),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'active_role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge
            variant={
              row.getValue('active_role') === 'admin'
                ? 'destructive'
                : 'default'
            }
          >
            {capitalize(row.getValue('active_role'))}
          </Badge>
        ),
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }) => (
          <Badge variant={'outline'} className="bg-">
            {capitalize(row.getValue('gender'))}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
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
              id={user.id}
            />
          );
        },
      },
    ],
    [handleEdit, handleDeleteClick],
  );

  if (isLoading) return <div className="container py-10">Loading...</div>;
  if (error)
    return <div className="container py-10">Error: Something went wrong</div>;

  return (
    <div className="container wrapper">
      <PageHeader
        title="Users"
        actionText="Add User"
        actionPath="/users/add-update"
      />
      <DataTable
        data={userData}
        columns={columns}
        totalRows={total || 0}
        filterOptions={{ defaultQuery: filters, setFilters }}
      />
      <ConfirmationModal
        open={modalState.open}
        setOpen={
          setModalState as unknown as React.Dispatch<
            React.SetStateAction<boolean>
          >
        }
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete User',
          description:
            'Are you sure you want to delete this user? This action cannot be undone.',
        }}
      />
    </div>
  );
};

export default UsersTable;
