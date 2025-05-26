'use client';

import { Button } from '@/components/ui/button';
import {
  useCreateResource,
  useDeleteResource,
  useResourceList,
  useUpdateResource,
} from '@/hooks/useAPIManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormElement } from '../common/form/formElement';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { SearchInput } from '../common/searchComponent';
import { DataTable } from '../common/table';
import ActionMenu from '../common/table/actionMenu';
import TableSN from '../common/table/tableSN';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Form } from '../ui/form';

interface IPostResponse {
  total: number;
  count: number;
  results: Post[];
}

interface Post {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  is_active: z.union([z.boolean(), z.string()]),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ModalState {
  type: 'delete' | 'add' | 'edit' | null;
  cmsId: string | null;
  open: boolean;
  editData?: Post | null;
}

const DEFAULT_MODAL_STATE: ModalState = {
  type: null,
  cmsId: null,
  open: false,
  editData: null,
};

const CategoriesList = () => {
  const [modalState, setModalState] = useState<ModalState>(DEFAULT_MODAL_STATE);
  const queryClient = new QueryClient();

  const {
    data: cmsData,
    total,
    isLoading,
    error,
    refetch,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<IPostResponse>('article-categories', {
    defaultQuery: { pageIndex: 0, pageSize: 10, search: '' },
  });

  // Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      is_active: modalState.editData?.is_active ? 'true' : 'false',
    },
  });

  const { mutate: createCategory, isPending: isCreating } =
    useCreateResource<CategoryFormData>('article-categories/', {
      onSuccess: () => {
        toast.success('Category created successfully');
        setModalState(DEFAULT_MODAL_STATE);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create category');
      },
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateResource<CategoryFormData>(
      `article-categories/${modalState.cmsId}`,
      {
        onSuccess: () => {
          toast.success('Category updated successfully');
          setModalState(DEFAULT_MODAL_STATE);
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update category');
        },
      },
    );

  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteResource<Post>('article-categories', {
      onSuccess: () => {
        toast.success('Category deleted successfully');
        setModalState(DEFAULT_MODAL_STATE);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete category');
      },
    });

  const handleEdit = useCallback(
    (id: string) => {
      const category = cmsData?.results.find((item) => item.id === id);
      if (category) {
        setModalState({
          type: 'edit',
          cmsId: id,
          open: true,
          editData: category,
        });
        form.reset({ name: category.name, is_active: category.is_active });
      }
    },
    [cmsData, form],
  );

  // Handle add
  const handleAddUpdateCategories = useCallback(() => {
    setModalState({ type: 'add', cmsId: null, open: true, editData: null });
    form.reset({ name: '', is_active: 'true' });
  }, [form]);

  // Handle delete
  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', cmsId: id, open: true, editData: null });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type !== 'delete' || !modalState.cmsId) return;
    try {
      deleteCategory({ id: modalState.cmsId });
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  }, [modalState, deleteCategory]);

  // Handle form submission
  const onSubmit = useCallback(
    async (values: CategoryFormData) => {
      try {
        if (modalState.type === 'edit' && modalState.cmsId) {
          updateCategory(values);
        } else {
          createCategory(values);
        }
      } catch (error) {
        console.error('Submission error:', error);
      }
    },
    [modalState, createCategory, updateCategory],
  );

  const isCreatingOrUpdating = isCreating || isUpdating;

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
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
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('is_active') as boolean;
          return (
            <Badge variant={status ? 'success' : 'destructive'}>
              {status ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
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
          const category = row.original;
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
              id={category.id}
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

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'InActive' },
  ];

  if (isLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (error) {
    return <div className="container py-10">Error: </div>;
  }

  return (
    <div className="container wrapper">
      <div className="flex justify-between items-center mb-4">
        <PageHeader title="Categories List" />
        <Button onClick={handleAddUpdateCategories}>Add</Button>
      </div>

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
        totalRows={total || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handleRowsPerPageChange}
        itemsPerPage={pageSize}
        filterOptions={{}}
        currentPage={pageIndex + 1}
      />

      <ConfirmationModal
        open={modalState.open && modalState.type === 'delete'}
        setOpen={setModalState as any}
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete Category',
          description:
            'Are you sure you want to delete this category? This action cannot be undone.',
        }}
      />

      <Dialog
        open={
          modalState.open &&
          (modalState.type === 'add' || modalState.type === 'edit')
        }
        onOpenChange={(open) => {
          if (!open) {
            setModalState(DEFAULT_MODAL_STATE);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalState.type === 'edit' ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormElement name="name" type="text" label="Category Name" />
              <FormElement
                label="Status"
                options={statusOptions}
                onChange={(value) => form.setValue('is_active', value)}
                value={form.watch('is_active') as string}
                placeholder="select status"
                type="select"
                name="is_active"
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalState(DEFAULT_MODAL_STATE);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingOrUpdating}>
                  {isCreatingOrUpdating ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
