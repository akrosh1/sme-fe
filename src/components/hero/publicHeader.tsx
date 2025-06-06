import Image from 'next/image';
import Link from 'next/link';
import govLogo from '/public/assets/GoN_logo.png';
import logoImg from '/public/assets/sme-logo.png';

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-17">
      <div className="flex items-center gap-5 md:gap-11  px-6 py-1 backdrop-blur-xl bg-[#f7f7f8]">
        <div className="flex items-center gap-2 mr-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoImg.src}
              alt="Crop Studio"
              width={132}
              height={50}
              className="object-cover"
            />
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={govLogo}
              alt="Crop Studio"
              width={50}
              height={50}
              className="object-cover"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 ">
          <Link
            href="#"
            className="text-sm text-gray-800 font-semibold hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Schemes
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Policies
          </Link>
          <Link
            href="#"
            className="text-sm  text-gray-800 font-semibold hover:text-black  transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex gap-2 ml-auto">
          <Link
            href="/register"
            className="bg-primary text-white hover:bg-primary/90 px-4 py-1 rounded-md transition-colors"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="bg-white text-primary hover:bg-primary/90 px-4 py-1 border border-accent rounded-md transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
