import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface NewsItem {
  id: number;
  image: string;
  date: string;
  location: string;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'warning';
}

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-none bg-transparent">
      <div className="relative h-56 w-full">
        <div className="absolute top-3 left-3 z-10">
          {news.badge && (
            <Badge
              variant={news.badgeVariant || 'default'}
              className={`
                ${news.badgeVariant === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              `}
            >
              {news.badge}
            </Badge>
          )}
        </div>
        <Image
          src={news.image || '/placeholder.svg'}
          alt={news.title}
          fill
          className="object-cover  rounded-[10px]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 36vw"
          priority
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{news.date}</span>
          <span className="mx-2">•</span>
          <span>{news.location}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{news.title}</h3>
        <p className="text-gray-600 text-sm">{news.description}</p>
      </CardContent>
    </Card>
  );
}
