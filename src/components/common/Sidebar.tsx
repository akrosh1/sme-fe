'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BellIcon,
  ChevronLeft,
  ChevronRight,
  FileCog,
  LayoutDashboardIcon,
  Menu,
  NotebookPen,
  SettingsIcon,
  ShieldUser,
  UsersIcon,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Types
export type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  route?: string;
  dropdownItems?: SidebarItem[];
  hasAccess?: boolean;
};

interface SidebarProps {
  className?: string;
}

type SidebarState = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  selectedMenu: string;
  selectedSubMenu: string;
  selectedSideBar: SidebarItem | null;
};

// Constants
const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboardIcon />,
    route: '/dashboard',
    hasAccess: true,
  },
  {
    label: 'Users',
    icon: <UsersIcon />,
    route: '/users',
    hasAccess: true,
  },
  {
    label: 'Roles',
    icon: <ShieldUser />,
    route: '/roles',
    hasAccess: true,
  },
  {
    label: 'CMS',
    icon: <FileCog />,
    route: '/cms',
    hasAccess: true,
  },
  {
    label: 'Articles',
    icon: <NotebookPen />,
    route: '/articles',
    hasAccess: true,
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    route: '/settings',
    hasAccess: true,
    dropdownItems: [
      {
        label: 'General',
        icon: <SettingsIcon />,
        route: '/settings/general',
        hasAccess: true,
      },
      {
        label: 'Notifications',
        icon: <BellIcon />,
        route: '/settings/notifications',
        hasAccess: true,
      },
    ],
  },
];

// Sub-components
const SidebarItemComponent = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) => {
  const content = (
    <div
      className={cn(
        'flex items-center space-x-2 rounded-md px-3 py-3 cursor-pointer transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'hover:bg-muted',
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex-shrink-0',
          isActive ? 'text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        {item.icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium">{item.label}</span>
          {item.dropdownItems && <ChevronRight className="ml-auto h-4 w-4" />}
        </>
      )}
    </div>
  );

  return isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  ) : (
    content
  );
};

const SubMenuItem = ({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      'flex items-center space-x-2 rounded-md px-3 py-2 cursor-pointer transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : 'hover:bg-muted',
    )}
    onClick={onClick}
  >
    <div
      className={cn(
        'flex-shrink-0',
        isActive ? 'text-primary-foreground' : 'text-muted-foreground',
      )}
    >
      {item.icon}
    </div>
    <span className="text-sm font-medium">{item.label}</span>
  </div>
);

const MobileSidebarContent = ({
  items,
  selectedMenu,
  selectedSubMenu,
  onMenuSelect,
  onSubMenuSelect,
}: {
  items: SidebarItem[];
  selectedMenu: string;
  selectedSubMenu: string;
  onMenuSelect: (item: SidebarItem) => void;
  onSubMenuSelect: (item: SidebarItem) => void;
}) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.label} className="space-y-1">
        <div
          className={cn(
            'flex items-center space-x-2 rounded-md px-3 py-2 cursor-pointer transition-colors',
            selectedMenu === item.label
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted',
          )}
          onClick={() => onMenuSelect(item)}
        >
          <div
            className={cn(
              'flex-shrink-0',
              selectedMenu === item.label
                ? 'text-primary-foreground'
                : 'text-muted-foreground',
            )}
          >
            {item.icon}
          </div>
          <span className="text-sm font-medium">{item.label}</span>
          {item.dropdownItems && (
            <ChevronRight
              className={cn(
                'ml-auto h-4 w-4 transition-transform',
                selectedMenu === item.label && 'rotate-90',
              )}
            />
          )}
        </div>

        {selectedMenu === item.label && item.dropdownItems && (
          <div className="ml-6 space-y-1 mt-1">
            {item.dropdownItems.map((subItem) => (
              <div
                key={subItem.label}
                className={cn(
                  'flex items-center space-x-2 rounded-md px-3 py-2 cursor-pointer transition-colors',
                  selectedSubMenu === subItem.label
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                )}
                onClick={() => onSubMenuSelect(subItem)}
              >
                <div
                  className={cn(
                    'flex-shrink-0',
                    selectedSubMenu === subItem.label
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {subItem.icon}
                </div>
                <span className="text-sm font-medium">{subItem.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

// Main Component
export const Sidebar = ({ className }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<SidebarState>({
    isCollapsed: false,
    isMobileOpen: false,
    selectedMenu: '',
    selectedSubMenu: '',
    selectedSideBar: null,
  });

  const {
    isCollapsed,
    isMobileOpen,
    selectedMenu,
    selectedSubMenu,
    selectedSideBar,
  } = state;

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const updateSelectedMenu = useCallback((path: string) => {
    const mainMenuItem = SIDEBAR_ITEMS.find(
      (item) =>
        item.route === path ||
        path.startsWith(item.route || '') ||
        item.dropdownItems?.some((subItem) => subItem.route === path),
    );

    if (mainMenuItem) {
      setState((prev) => ({
        ...prev,
        selectedMenu: mainMenuItem.label,
      }));

      if (mainMenuItem.dropdownItems) {
        const subMenuItem = mainMenuItem.dropdownItems.find(
          (item) => item.route === path,
        );

        if (subMenuItem) {
          setState((prev) => ({
            ...prev,
            selectedSubMenu: subMenuItem.label,
            selectedSideBar: mainMenuItem,
            isCollapsed: true,
          }));
        }
      }
    }
  }, []);

  // Update selected menu based on current path
  useEffect(() => {
    if (pathname) {
      updateSelectedMenu(pathname);
    }
  }, [pathname, updateSelectedMenu]);

  // Update selected sidebar when menu changes
  useEffect(() => {
    const mainMenu = SIDEBAR_ITEMS.find((item) => item.label === selectedMenu);
    setState((prev) => ({
      ...prev,
      selectedSideBar: mainMenu?.dropdownItems ? mainMenu : null,
    }));
  }, [selectedMenu]);

  const handleMenuSelect = useCallback(
    (item: SidebarItem) => {
      setState((prev) => ({ ...prev, selectedMenu: item.label }));

      if (item.dropdownItems?.length) {
        setState((prev) => ({
          ...prev,
          selectedSideBar: item,
          isCollapsed: true,
        }));
      } else if (item.route) {
        router.push(item.route);
      }
    },
    [router],
  );

  const handleSubMenuSelect = useCallback(
    (item: SidebarItem) => {
      setState((prev) => ({ ...prev, selectedSubMenu: item.label }));
      if (item.route) {
        router.push(item.route);
      }
    },
    [router],
  );

  const handleMobileMenuSelect = useCallback(
    (item: SidebarItem) => {
      if (item.route) {
        router.push(item.route);
        setState((prev) => ({ ...prev, isMobileOpen: false }));
      }
      setState((prev) => ({ ...prev, selectedMenu: item.label }));
    },
    [router],
  );

  const handleMobileSubMenuSelect = useCallback(
    (item: SidebarItem) => {
      if (item.route) {
        router.push(item.route);
        setState((prev) => ({ ...prev, isMobileOpen: false }));
      }
      setState((prev) => ({ ...prev, selectedSubMenu: item.label }));
    },
    [router],
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={() => setState((prev) => ({ ...prev, isMobileOpen: true }))}
          className="rounded-full bg-gray-200 text-primary hover:bg-gray-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, isMobileOpen: open }))
        }
      >
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b-accent">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <MobileSidebarContent
                items={SIDEBAR_ITEMS}
                selectedMenu={selectedMenu}
                selectedSubMenu={selectedSubMenu}
                onMenuSelect={handleMobileMenuSelect}
                onSubMenuSelect={handleMobileSubMenuSelect}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav
        className={cn(
          'hidden md:flex h-screen sticky top-0 bg-background',
          className,
        )}
      >
        <motion.div
          className="h-full border-r-accent bg-sidebar flex flex-col"
          initial={false}
          animate={{ width: isCollapsed ? 64 : 240 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-3 flex items-center justify-between border-b border-b-accent">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold">Dashboard</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn('ml-auto', isCollapsed && 'mx-auto')}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <TooltipProvider delayDuration={0}>
              <div className="space-y-1 px-2">
                {SIDEBAR_ITEMS.map((item) => (
                  <SidebarItemComponent
                    key={item.label}
                    item={item}
                    isActive={selectedMenu === item.label}
                    isCollapsed={isCollapsed}
                    onClick={() => handleMenuSelect(item)}
                  />
                ))}
              </div>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Submenu sidebar */}
        {selectedSideBar?.dropdownItems && (
          <motion.div
            className="h-full border-r bg-muted/50 flex flex-col"
            initial={{ width: 0 }}
            animate={{
              width: isCollapsed ? 200 : 0,
            }}
            style={{ display: isCollapsed ? 'flex' : 'none' }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 py-4.5 border-b border-b-gray-300">
              <h3 className="font-medium">{selectedSideBar.label}</h3>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <div className="space-y-1 px-2">
                {selectedSideBar.dropdownItems.map((subItem) => (
                  <SubMenuItem
                    key={subItem.label}
                    item={subItem}
                    isActive={selectedSubMenu === subItem.label}
                    onClick={() => handleSubMenuSelect(subItem)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};
