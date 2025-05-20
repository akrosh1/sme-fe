'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  actionText?: string;
  actionPath?: string;
  className?: string;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  subTitle,
  actionText = 'Add',
  actionPath,
  className = '',
}) => {
  const router = useRouter();

  return (
    <div className={`flex mb-5 items-center justify-between ${className}`}>
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        {subTitle && <p className="text-muted-foreground">{subTitle}</p>}
      </div>

      {actionPath && (
        <Button
          variant={'outline'}
          className="btn btn-primary cursor-pointer"
          onClick={() => router.push(actionPath)}
        >
          {actionText.toLowerCase() === 'back' ? (
            <ArrowLeft className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
