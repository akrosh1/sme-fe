'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppDispatch } from '@/hooks/useDispatch';
import { useIsMobile } from '@/hooks/useMobile';
import { logout } from '@/store/slices/authSlice';
import { Bell, LogOutIcon, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = 'token=; Max-Age=0';
    document.cookie = 'role=; Max-Age=0';
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center  space-x-2 justify-end">
          <nav className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-white p-3 border-none">
                <div className="flex flex-col p-2 space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-1 px-3 rounded hover:bg-gray-200 cursor-pointer"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link
                    href="/setting"
                    className="flex items-center gap-2 py-1 px-3 rounded hover:bg-gray-200 cursor-pointer"
                  >
                    <Settings size={16} />
                    Setting
                  </Link>
                  <div
                    className="flex items-center gap-2 py-1 px-3 rounded hover:bg-red-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOutIcon size={16} />
                    Logout
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </nav>
        </div>
      </div>
    </header>
  );
}
