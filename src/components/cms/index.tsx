'use client';

import { useResourceList } from '@/hooks/useAPIManagement';
import { useDebounce } from '@/hooks/useDebounce';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { DataTable } from '../common/table';
import { Button } from '../ui/button';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  active_role: string;
  gender: string;
  createdAt: string;
}

export type Post = {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
};

const CMSList = () => {
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
      router.push(`/users/add-update/${id}`);
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

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 's.n.',
      header: 'S.N.',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'content',
      header: 'Content',
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteClick(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="container py-10">Loading...</div>;
  if (error)
    return <div className="container py-10">Error: Something went wrong</div>;

  return (
    <div className="container wrapper">
      <PageHeader
        title="CMS List"
        actionText="Add CMS"
        actionPath="/cms/form"
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

export default CMSList;
