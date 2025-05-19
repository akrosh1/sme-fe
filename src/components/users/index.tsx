'use client';

import { useResourceList } from '@/hooks/useAPIManagement';
import { useDebounce } from '@/hooks/useDebounce';
import capitalize from '@/utils/capitalizeTextCase';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { DataTable } from '../common/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [modalState, setModalState] = useState<{
    type: 'edit' | 'delete' | null;
    userId: string | null;
    open: boolean;
  }>({ type: null, userId: null, open: false });

  const {
    data: users,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<User>('profiles', {
    defaultQuery: { pageIndex: 0, pageSize: 10 },
  });
  console.log('🚀 ~ UsersTable ~ users:', users);

  const debouncedFilterChange = useDebounce(
    (newFilters: Record<string, any>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, pageIndex: 0 }));
    },
    500,
  );

  const userData = useMemo(
    () =>
      users?.results?.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        active_role: user.active_role,
        gender: user.gender,
        createdAt: user.createdAt,
      })) || [],
    [users?.results],
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/users/add-update?userId=${id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', userId: id, open: true });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type === 'delete' && modalState.userId) {
      try {
        // Add your delete API call here
        console.log('Deleting user:', modalState.userId);
        // await deleteUser(modalState.userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setModalState({ type: null, userId: null, open: false });
      }
    }
  }, [modalState]);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setFilters((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    [setFilters],
  );

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const name = row.getValue('name') as string;
          return name && capitalize(name);
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'active_role',
        header: 'Role',
        cell: ({ row }) => {
          const role = row.getValue('active_role') as string;
          return (
            <Badge
              variant={
                role === 'admin'
                  ? 'destructive'
                  : role === 'EDITOR'
                    ? 'secondary'
                    : 'default'
              }
            >
              {capitalize(role)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }) => {
          const gender = row.getValue('gender') as string;
          return (
            <Badge
              variant={
                gender === 'male'
                  ? 'default'
                  : gender === 'female'
                    ? 'destructive'
                    : 'outline'
              }
            >
              {capitalize(gender)}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteClick(user.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        pagination={{
          state: { pageIndex, pageSize },
          onPaginationChange: handlePaginationChange,
          rowCount: total || 0,
        }}
        sorting={{
          state: sorting,
          onSortingChange: setSorting,
        }}
        columnVisibility={{
          state: columnVisibility,
          onColumnVisibilityChange: setColumnVisibility,
        }}
        filters={filters}
        onFilterChange={debouncedFilterChange}
        headerControls={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Filter by date
            </Button>
          </div>
        }
      />

      <ConfirmationModal
        open={modalState.open}
        setOpen={(open) => setModalState((prev) => ({ ...prev, open }))}
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete User',
          description:
            'Are you sure you want to delete this user? This action cannot be undone.',

          // // confirmText: 'Delete',
          // confirmText: 'Delete',
          // cancelText: 'Cancel',
        }}
      />
    </div>
  );
};

export default UsersTable;
