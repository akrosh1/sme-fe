import { Button } from '@/components/ui/button';
import { CompactNewsCard } from './compactNewsCard';
import { NewsCard } from './newsCard';

export default function NewsAndEvents() {
  const featuredNews = [
    {
      id: 1,
      image: '/assets/news1.jpg',
      date: '08-11-2024',
      location: 'Kathmandu',
      title: 'Believing neglected so so allowance existence departure.',
      description:
        'Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.',
      badge: 'Coming Soon',
      badgeVariant: 'warning' as const,
    },
    {
      id: 2,
      image: '/assets/news2.jpg',
      date: '08-11-2021',
      location: 'Itahari',
      title:
        'In design active temper be uneasy. Thirty for remove plenty regard you.',
      description:
        'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
      badge: 'News',
      badgeVariant: 'default' as const,
    },
  ];

  const compactNews = [
    {
      id: 3,
      image: '/assets/news1.jpg',
      date: '08-11-2021',
      category: 'Webinar',
      title: 'Partiality on or continuing in particular principles',
    },
    {
      id: 4,
      image: '/assets/news2.jpg',
      date: '08-11-2021',
      category: 'News',
      title: 'Do believing oh disposing to supported allowance we.',
    },
    {
      id: 5,
      image: '/assets/news1.jpg',
      date: '08-11-2021',
      category: 'News',
      title: 'Village did removed enjoyed explain nor ham saw.',
    },
    {
      id: 6,
      image: '/assets/news2.jpg',
      date: '08-11-2021',
      category: 'Category',
      title: 'Securing as informed declared or margaret.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Our News & Events</h2>
          <Button variant="default" className="bg-primary text-white">
            See All Events Posts
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {featuredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          <div className="space-y-6">
            {compactNews.map((item) => (
              <CompactNewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
