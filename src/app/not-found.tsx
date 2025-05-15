import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NotFoundImg from '../../public/assets/404.svg';

export default function Component() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3 flex flex-col items-center">
          <Image
            src={NotFoundImg.src}
            height={200}
            width={200}
            alt="404 Page Not Found"
          />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404 Page Not Found
          </h1>
          <p className="text-gray-500">
            Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md text-white  bg-primary shadow-sm px-8 text-sm font-medium transition-colors hover:bg-primary/90"
          prefetch={false}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
