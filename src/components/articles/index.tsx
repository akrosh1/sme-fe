'use client';

import { useDeleteResource, useResourceList } from '@/hooks/useAPIManagement';
import { QueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import { Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationModal } from '../common/modal/confirmationModal';
import PageHeader from '../common/PageHeader';
import { SearchInput } from '../common/searchComponent';
import { DataTable } from '../common/table';
import ActionMenu from '../common/table/actionMenu';
import TableSN from '../common/table/tableSN';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import ArticleCard from './components/articleCard';

interface IPostResponse {
  total: number;
  count: number;
  results: ArticleCardProps[];
}

interface ArticleCardProps {
  id: string;
  title: string;
  body: string;
  tags: string;
  created_at: string;
  medias?: string;
  created_by_name?: string;
  created_by_image?: string;
}

interface ModalState {
  type: 'delete' | null;
  articleId: string | null;
  open: boolean;
}

const DEFAULT_MODAL_STATE: ModalState = {
  type: null,
  articleId: null,
  open: false,
};

const Articles = () => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [modalState, setModalState] = useState<ModalState>(DEFAULT_MODAL_STATE);

  const {
    data: articlesData,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    pageIndex,
    pageSize,
  } = useResourceList<IPostResponse>('articles', {
    defaultQuery: { pageIndex: 0, pageSize: 10, search: '' },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/articles/form?id=${id}`);
    },
    [router],
  );

  const handleView = useCallback(
    (id: string) => {
      router.push(`articles/view/page?id=${id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setModalState({ type: 'delete', articleId: id, open: true });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (modalState.type !== 'delete' || !modalState.articleId) return;
    try {
      deleteArticle({ id: modalState.articleId });
    } catch (err) {
      console.error('Error deleting article:', err);
    } finally {
      setModalState(DEFAULT_MODAL_STATE);
    }
  }, [modalState]);

  const { mutate: deleteArticle, isPending: isDeleting } =
    useDeleteResource<ArticleCardProps>(`articles`, {
      onSuccess: () => {
        toast.success('Article deleted successfully');
        setModalState(DEFAULT_MODAL_STATE);
        queryClient.fetchQuery({ queryKey: ['articles'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to delete article');
      },
    });

  const columns = useMemo<ColumnDef<ArticleCardProps>[]>(
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
        accessorKey: 'body',
        header: 'Content',
        enableSorting: false,
        cell: ({ getValue }) => (
          <div
            className="prose overflow-ellipsis line-clamp-1"
            dangerouslySetInnerHTML={{ __html: getValue<string>() }}
          ></div>
        ),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => (
          <Badge variant={'outline'}>{capitalize(row.original.tags)}</Badge>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: 'created_by_name',
        header: 'Author',
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const article = row.original;
          return (
            <ActionMenu
              actions={[
                {
                  label: 'Edit',
                  onClick: handleEdit,
                  variant: 'ghost',
                },
                {
                  label: 'View',
                  onClick: handleView,
                  variant: 'ghost',
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteClick,
                  variant: 'danger',
                },
              ]}
              id={article.id}
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

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'card' ? 'table' : 'card'));
  };

  if (isLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (error) {
    return <div className="container py-10">Error: </div>;
  }

  return (
    <div className="wrapper">
      <div className="flex justify-between items-center mb-4">
        <PageHeader
          title="All Articles"
          actionText="Add"
          actionPath="/articles/form"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'outline'}
              onClick={toggleViewMode}
              className="p-2 rounded hover:bg-gray-200 mb-4 cursor-pointer dark:hover:bg-gray-700 ml-5 w-[40px]"
            >
              {viewMode === 'card' ? <List size={24} /> : <Grid size={24} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {viewMode === 'card'
              ? 'Switch to table view'
              : 'Switch to card view'}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-end mb-4">
        <SearchInput
          onChange={(value) => setFilters({ search: value })}
          placeholder="Search by title"
        />
      </div>

      {viewMode === 'card' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesData?.results?.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.body}
              category={article.tags}
              date={article.created_at.split('T')[0]}
              author={article.created_by_name}
              authorImage={article.created_by_image}
              slug={article.id}
              image={
                article?.medias?.[0] ??
                'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600&h=400&auto=format&fit=crop'
              }
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={articlesData?.results || []}
          key={Math.random()}
          totalRows={total || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handleRowsPerPageChange}
          itemsPerPage={pageSize}
          filterOptions={{}}
          currentPage={pageIndex + 1}
        />
      )}

      <ConfirmationModal
        open={modalState.open}
        setOpen={
          setModalState as unknown as React.Dispatch<
            React.SetStateAction<boolean>
          >
        }
        handleConfirm={handleConfirmDelete}
        content={{
          title: 'Delete Article',
          description:
            'Are you sure you want to delete this article? This action cannot be undone.',
        }}
      />
    </div>
  );
};

export default Articles;
