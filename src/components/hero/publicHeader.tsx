import Image from 'next/image';
import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-kn1C5CDk5zUaYa4BHkG1FKUQupEsrm.png"
              alt="Crop Studio"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-medium text-black">YMC Dashboard</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm text-gray-800 font-semibold hover:text-black transition-colors"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Help
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Community
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Contact
          </Link>
        </nav>
        <Link
          href="/login"
          className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          Login/Register
        </Link>
      </div>
    </header>
  );
}
