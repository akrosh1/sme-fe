'use client';

import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { useToast } from '@/hooks/useToast';
import { formatDate } from 'date-fns';
import {
  ArrowLeft,
  BrainCircuit,
  Clock,
  Edit,
  Facebook,
  Linkedin,
  Share2,
  Twitter,
  TwitterIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface ArticleFormValues {
  id: number;
  title: string;
  body: string;
  tags: string[];
  medias: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ViewArticle() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  const { toast } = useToast();

  const { data: post, isLoading } = useFetch<
    'get',
    { id: string },
    ArticleFormValues
  >(`articles/${articleId}`, 'get', {
    enabled: !!articleId,
    //  @ts-expect-error will be fixed later
    onError: (error: AxiosError) => {
      console.error(
        `Failed to fetch user with ID ${articleId}:`,
        error?.message,
      );
    },
    select: (data: { data: ArticleFormValues }) => data.data,
  });

  console.log('🚀 ~ ViewArticle ~ post:', post);

  useEffect(() => {
    if (!post) {
      toast({
        title: 'Post not found',
        description: 'The requested blog post could not be found.',
        variant: 'destructive',
      });
    }
  }, [post, toast]);

  if (!post) {
    return (
      <div className="wrapper  text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Link href="/articles">Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied',
          description: 'The article link has been copied to your clipboard.',
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleEdit = () => {
    window.location.href = `/articles/form?articleId=${articleId}`;
  };
  return (
    <div className="min-h-screen wrapper  text-foreground">
      <div className="flex justify-end items-center">
        <PageHeader title={''} actionText="Back" actionPath="/articles" />
        <Edit
          className="bg-accent h-8 w-8 p-2 rounded curdor-pointer"
          onClick={handleEdit}
        />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-primary mb-4">
            <BrainCircuit className="h-5 w-5" />
            <span>{post.tags.map((tag) => tag).join(', ')}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{'6 min read'}</span>
            </div>
            <div>{formatDate(post.created_at, 'yyyy-MM-dd')}</div>
            <div>By {post.author}</div>
          </div>

          <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden border border-gray-800 mb-8">
            <Image
              src={post.image || ''}
              alt="Article hero image showing GAN-generated art"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <div className="flex justify-between items-center my-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary hover:bg-primary hover:text-white"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary hover:bg-primary hover:text-white"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary hover:bg-primary hover:text-white"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-primary hover:bg-primary hover:text-white"
              onClick={() => handleShare('clipboard')}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          <article className="prose prose-invert prose-purple max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            {/* <div className="grid md:grid-cols-2 gap-6">
              {post &&
                post?.map((relatedPost, index) => (
                  <Link
                    href={`/blog/${relatedPost.slug}/`}
                    className="group"
                    key={index}
                  >
                    <div className="space-y-3">
                      <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-primary/50 transition-colors">
                        <Image
                          src={relatedPost.image || '/placeholder.svg'}
                          alt={`${relatedPost.title} thumbnail`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-primary mb-2">
                          <BrainCircuit className="h-4 w-4" />
                          <span>{relatedPost.category}</span>
                        </div>
                        <h3 className="font-medium group-hover:text-purple-400 transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
            </div> */}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              YCM<span className="text-primary">Dashboard</span>
            </Link>
            <p className="text-gray-400 text-sm mt-4 mb-6">
              Exploring the cutting edge of artificial intelligence and machine
              learning.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
              <p>
                © {new Date().getFullYear()} NeuralPulse. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
