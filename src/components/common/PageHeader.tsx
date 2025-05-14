'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface PageHeaderProps {
  title: string;
  actionText?: string;
  actionPath?: string;
  className?: string;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  actionText = 'Add',
  actionPath,
  className = '',
}) => {
  const router = useRouter();

  return (
    <div className={`flex mb-5 items-center justify-between ${className}`}>
      <h1 className="text-xl md:text-2xl font-bold mb-6">{title}</h1>
      {actionPath && (
        <Button
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
