'use client';

import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Database,
  HelpCircle,
  Menu,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface MenuItem {
  name: string;
  href: string;
  items?: MenuItem[];
}

interface MenuGroup {
  title: string;
  icon: React.ReactNode;
  items?: MenuItem[];
  link?: string;
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Dashboard',
    icon: <Database className="h-5 w-5" />,
    link: '/dashboard',
  },
  {
    title: 'Queries',
    icon: <Search className="h-5 w-5" />,
    items: [{ name: 'Queries', href: '/queries' }],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleGroup = (path: string) => {
    setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const isActive = (href: string) => pathname === href;

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.items && item.items.length > 0;
    const isGroupCollapsed = collapsed[item.href];
    const paddingLeft = `${depth * 16 + 16}px`;

    return (
      <div key={item.href} style={{ paddingLeft }}>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-2 py-2 px-4 hover:bg-white/5 cursor-pointer',
            isActive(item.href) && 'bg-white/10 font-medium',
          )}
        >
          {hasChildren ? (
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isGroupCollapsed && 'rotate-90',
              )}
            />
          ) : (
            <div className="w-4" />
          )}
          <span className="flex-1">{item.name}</span>
        </Link>
        {hasChildren && isGroupCollapsed && (
          <div className="bg-black/10">
            {item.items?.map((subItem) => renderMenuItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-primary text-white transition-all duration-300 h-screen overflow-y-auto flex flex-col',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 sticky top-0 bg-primary z-10">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Dashboad APP</span>
              <span className="text-xs text-gray-400">Version 1.0</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded p-1 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 p-2">
          {menuGroups.map((group) => (
            <div key={group.title}>
              {group.link ? (
                <Link
                  href={group.link}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  {group.icon}
                  {sidebarOpen && (
                    <span className="flex-1 text-left">{group.title}</span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2 hover:bg-white/10',
                    collapsed[group.title] && 'bg-white/5',
                  )}
                >
                  {group.icon}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{group.title}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          collapsed[group.title] && 'rotate-180',
                        )}
                      />
                    </>
                  )}
                </button>
              )}
              {collapsed[group.title] && sidebarOpen && (
                <div className="bg-black/20">
                  {group.items?.map((item) => renderMenuItem(item))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {sidebarOpen && (
        <div className="sticky bottom-0 p-4 bg-primary border-t border-white/10">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Support</span>
          </div>
        </div>
      )}
    </div>
  );
}
