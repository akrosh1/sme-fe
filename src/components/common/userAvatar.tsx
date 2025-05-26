import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  userStatus?: string;
}

export function UserAvatar({
  src,
  alt,
  userStatus,
  className,
}: UserAvatarProps) {
  return (
    <div className="relative">
      <Avatar className={cn('h-[28px] w-[28px]', className)}>
        <AvatarImage
          src={src}
          srcSet={src}
          alt={alt}
          className="object-cover"
        />
        <AvatarFallback>
          <Image
            src={src || 'https://via.placeholder.com/150'}
            alt={alt || ''}
            className={cn('h-[28px] w-[28px]', className)}
            width={28}
            height={28}
          />
        </AvatarFallback>
      </Avatar>
      {userStatus && (
        <span
          className={cn(
            'absolute -bottom-0.5 right-0 h-2.5 w-2.5 rounded-full border border-white',
            {
              'bg-green-500': userStatus === 'available',
              'bg-gray-400': userStatus === 'offline',
              'bg-yellow-500': userStatus === 'busy',
            },
          )}
        ></span>
      )}
    </div>
  );
}
