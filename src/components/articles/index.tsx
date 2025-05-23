'use client';
import { useResourceList } from '@/hooks/useAPIManagement';
import PageHeader from '../common/PageHeader';
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

const Articles = () => {
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
    defaultQuery: { pageIndex: 0, pageSize: 10 },
  });
  console.log('🚀 ~ Article ~ articles:', articlesData);

  return (
    <div className="wrapper">
      <PageHeader
        title="All Articles"
        actionText="Add"
        actionPath="/articles/form"
      />

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
    </div>
  );
};

export default Articles;
