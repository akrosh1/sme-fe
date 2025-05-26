import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, Shapes } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  slug?: string;
  image?: string;
  author?: string;
  authorImage?: string;
}

function ArticleCard({
  title,
  description,
  category,
  date,
  slug = '',
  image,
  author,
  authorImage,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/view/page?id=${slug}`} className="group">
      <div className="space-y-3">
        <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
          <Image
            src={image || 'https://via.placeholder.com/150'}
            alt={`${title} thumbnail`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-primary mb-2">
            <Shapes className="h-4 w-4" />
            <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-500">
              {category}
            </span>
          </div>
          <h3 className="font-medium group-hover:text-primary/90 transition-colors">
            {title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="text-gray-400 text-sm mt-2 line-clamp-2"
          ></div>

          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      authorImage ||
                      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-kn1C5CDk5zUaYa4BHkG1FKUQupEsrm.png'
                    }
                  />
                  <AvatarFallback>{author?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-gray-800">{author}</p>
                  <span className="text-xs text-gray-400">{date}</span>
                </div>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 group-hover:text-primary/90 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
