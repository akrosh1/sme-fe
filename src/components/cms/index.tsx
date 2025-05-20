'use client';

import { useDeleteResource, useResourceList } from '@/hooks/useAPIManagement';
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
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

interface ModalState {
  type: 'delete' | null;
  cmsId: string | null;
  open: boolean;
}

const DEFAULT_MODAL_STATE: ModalState = {
  type: null,
  cmsId: null,
  open: false,
};

const CMSList = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>(DEFAULT_MODAL_STATE);
  const queryClient = new QueryClient();

  const {
    data: cmsData,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<IPostResponse>('cms-pages', {
    defaultQuery: { pageIndex: 0, pageSize: 10, search: '' },
  });
  console.log('🚀 ~ CMSList ~ cmsData:', cmsData);
  console.log('🚀 ~ CMSList ~ total:>>', total);
  console.log('🚀 ~ CMSList ~ filters:', filters);
  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/cms/form?id=${id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', cmsId: id, open: true });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type !== 'delete' || !modalState.cmsId) return;
    try {
      deleteCMS({ id: modalState.cmsId });
    } catch (err) {
      console.error('Error deleting CMS:', err);
    } finally {
      setModalState(DEFAULT_MODAL_STATE);
    }
  }, [modalState]);

  const { mutate: deleteCMS, isPending: isCreating } = useDeleteResource<Post>(
    `cms-pages`,
    {
      onSuccess: () => {
        toast.success('CMS deleted successfully');
        setModalState(DEFAULT_MODAL_STATE);
        queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete CMS');
      },
    },
  );

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
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'content',
        header: 'Content',
        enableSorting: false,
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ getValue }) => (getValue<boolean>() ? 'Active' : 'Inactive'),
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString(),
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
    [handleEdit, handleDeleteClick],
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
    return <div className="container py-10">Error:</div>;
  }

  return (
    <div className="container wrapper">
      <PageHeader
        title="CMS List"
        actionText="Add CMS"
        actionPath="/cms/form"
      />

      <div className="flex justify-end mb-4">
        <SearchInput
          onChange={(value) => setFilters({ search: value })}
          placeholder="Search by title"
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

      <ConfirmationModal
        open={modalState.open}
        setOpen={
          setModalState as unknown as React.Dispatch<
            React.SetStateAction<boolean>
          >
        }
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete CMS Page',
          description:
            'Are you sure you want to delete this CMS page? This action cannot be undone.',
        }}
      />
    </div>
  );
};

export default CMSList;
