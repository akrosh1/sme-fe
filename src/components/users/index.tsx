'use client';

import { useResourceList } from '@/hooks/useAPIManagement';
import { useDebounce } from '@/hooks/useDebounce';
import capitalize from '@/utils/capitalizeTextCase';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmationModal } from '../common/modal/confirmationModal';
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

// Example data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status?: string; // Added status to match column usage
}

const handleDelete = (id: string) => {
  console.log(id);
};

const handleEdit = (id: string) => {
  console.log(id);
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return name && name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
      console.log('🚀 ~ role:', role);
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
            <DropdownMenuItem onSelect={() => handleEdit(user.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDelete(user.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UsersTable() {
  const {
    data: users,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pageIndex,
    pageSize,
  } = useResourceList<User>('profiles', {
    defaultQuery: { pageIndex: 0, pageSize: 10 },
  });

  const debounce = useDebounce(5000);

  console.log('🚀 ~ UsersTable ~ users:', users);

  const userData = useMemo(
    () =>
      users?.results?.map((user) => ({
        id: user.id,
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        active_role: user.active_role,
        createdAt: user.createdAt,
        gender: user.gender,
      })) || [],
    [users?.results],
  );

  // Sorting state
  const [sorting, setSorting] = useState([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({});

  // Modal state for edit/delete
  const [modalState, setModalState] = useState<{
    type: 'edit' | 'delete' | null;
    userId: string | null;
    open: boolean;
  }>({ type: null, userId: null, open: false });

  console.log('🚀 ~ UsersTable ~ modalState:', modalState);
  // Debounced filter change handler
  // const handleFilterChange = useCallback(
  //   debounce((newFilters: Record<string, any>) => {
  //     const hasChanged =
  //       Object.keys(newFilters).some(
  //         (key) => filters[key] !== newFilters[key],
  //       ) ||
  //       Object.keys(filters).some((key) => !newFilters.hasOwnProperty(key));

  //     if (hasChanged) {
  //       setFilters(newFilters);
  //       // Reset pageIndex to 0 when filters change
  //       setFilters((prev) => ({ ...prev, pageIndex: 0 }));
  //     }
  //   }, 300),
  //   [filters, setFilters],
  // );

  // Handlers for edit/delete
  const handleEdit = useCallback((id: string) => {
    setModalState({ type: 'edit', userId: id, open: true });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setModalState({ type: 'delete', userId: id, open: true });
  }, []);

  const handleConfirm = useCallback(() => {
    if (modalState.type === 'edit') {
      console.log('Editing user:', modalState.userId);
    } else if (modalState.type === 'delete') {
      console.log('Deleting user:', modalState.userId);
    }
    setModalState({ type: null, userId: null, open: false });
  }, [modalState]);

  // Sync pagination with useResourceList
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

  if (isLoading) return <div className="container py-10">Loading...</div>;
  if (error)
    return (
      <div className="container py-10">Error: {(error as any).message}</div>
    );

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <DataTable
        data={userData}
        columns={columns}
        pagination={{
          state: { pageIndex, pageSize },
          onPaginationChange: handlePaginationChange,
          rowCount: total || userData.length,
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
        // onFilterChange={handleFilterChange}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        headerControls={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Filter by date
            </Button>
          </div>
        }
      />
      {/* Render modals outside the table */}
      {modalState.open && (
        <ConfirmationModal
          handleConfirm={handleConfirm}
          open={modalState.open}
          content={{
            title: modalState.type === 'edit' ? 'Edit User' : 'Delete User',
            description: `Are you sure you want to ${modalState.type} this user?`,
          }}
          setOpen={(open) => setModalState((prev) => ({ ...prev, open }))}
        />
      )}
    </div>
  );
}
