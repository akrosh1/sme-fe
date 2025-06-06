import Image from 'next/image';

interface CompactNewsItem {
  id: number;
  image: string;
  date: string;
  category: string;
  title: string;
}

interface CompactNewsCardProps {
  news: CompactNewsItem;
}

export function CompactNewsCard({ news }: CompactNewsCardProps) {
  return (
    <div className="flex gap-4 border-b border-gray-400 pb-4">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={news.image || '/placeholder.svg'}
          alt={news.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span>{news.date}</span>
          <span className="mx-2">•</span>
          <span>{news.category}</span>
        </div>
        <h3 className="font-medium text-sm line-clamp-2">{news.title}</h3>
      </div>
    </div>
  );
}
