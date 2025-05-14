'use client';

import { motion } from 'framer-motion';
import {
  Building,
  ChevronLeft,
  ChevronRight,
  Home,
  HomeIcon,
  SettingsIcon,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Define types for sidebar items
type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  link?: string;
  dropdownItems?: SidebarItem[];
  subItems?: SidebarItem[];
};

type DisplaySidebarListItemsProps = {
  items: SidebarItem[];
  className?: string;
  selectedItem: string;
  onItemClick: (label: string) => void;
  isCollapsed: boolean;
  type?: 'sidebar';
};

// Memoize the list item component to prevent unnecessary re-renders
const DisplaySidebarListItems = React.memo(
  ({
    items,
    className,
    selectedItem,
    onItemClick,
    isCollapsed,
    type,
  }: DisplaySidebarListItemsProps) => {
    const isNotCollapsedAndSidebar = !isCollapsed || type;

    return (
      <div className={className}>
        {items.map((item) => (
          <SidebarListItem
            key={item.label}
            item={item}
            isNotCollapsedAndSidebar={isNotCollapsedAndSidebar}
            selectedItem={selectedItem}
            onItemClick={onItemClick}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    );
  },
);

// Extract list item into separate component for better memoization
const SidebarListItem = React.memo(
  ({
    item,
    isNotCollapsedAndSidebar,
    selectedItem,
    onItemClick,
    isCollapsed,
  }: {
    item: SidebarItem;
    isNotCollapsedAndSidebar: boolean;
    selectedItem: string;
    onItemClick: (label: string) => void;
    isCollapsed: boolean;
  }) => {
    return (
      <div
        className={`group flex ${
          isNotCollapsedAndSidebar ? 'justify-between' : 'justify-center'
        } rounded-md items-center ${
          selectedItem === item.label
            ? isNotCollapsedAndSidebar
              ? '!bg-cyprus-800'
              : '!bg-cyprus-50'
            : ''
        }`}
        onClick={() => onItemClick(item.label)}
      >
        <div
          className={`flex items-center ${
            isNotCollapsedAndSidebar ? 'p-3' : 'py-3'
          } cursor-pointer`}
        >
          {item.icon && (
            <div
              className={`${isNotCollapsedAndSidebar && 'w-9'} ${
                selectedItem === item.label
                  ? isNotCollapsedAndSidebar
                    ? 'text-cyprus-50'
                    : 'text-cyprus-800'
                  : isNotCollapsedAndSidebar
                    ? 'text-current group-hover:text-grey-900'
                    : 'text-cyprus-50 group-hover:text-white'
              }`}
            >
              {item.icon}
            </div>
          )}
          {(!isCollapsed || isNotCollapsedAndSidebar) && (
            <div
              className={`${
                selectedItem === item.label
                  ? 'text-cyprus-50'
                  : 'group-hover:text-grey-900'
              }`}
            >
              {item.label}
            </div>
          )}
        </div>
        {item.dropdownItems && !isCollapsed && (
          <ChevronRight className="cursor-pointer h-4" />
        )}
      </div>
    );
  },
);

export const Sidebar = React.memo(() => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [selectedSubMenu, setSelectedSubMenu] = useState('');
  const [selectedSideBar, setSelectedSideBar] = useState<SidebarItem | null>(
    null,
  );

  // Memoize sidebar items to prevent recreation on every render
  const sidebarListItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Dashboard', link: '/dashboard', icon: <HomeIcon /> },
      {
        label: 'Users',
        icon: <SettingsIcon />,
        dropdownItems: [
          { label: 'User', link: '/users', icon: <SettingsIcon /> },
          { label: 'Role', link: '/roles', icon: <Users /> },
          { label: 'CMS', link: '/cms', icon: <Building /> },
        ],
      },
    ],
    [],
  );

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleMainItemClick = useCallback(
    (label: string) => {
      const item = sidebarListItems.find((item) => item.label === label);
      if (item) {
        if (item.link) {
          router.push(item.link);
        }
        if (item.dropdownItems) {
          setSelectedSideBar(item);
          setIsCollapsed(true);
        } else {
          setSelectedSideBar(null);
        }
        setSelectedMenu(label);
      }
    },
    [router, sidebarListItems],
  );

  const handleSubItemClick = useCallback((label: string) => {
    setSelectedSubMenu(label);
  }, []);

  useEffect(() => {
    const mainMenu = sidebarListItems.find(
      (item) => item.label === selectedMenu,
    );
    if (mainMenu?.dropdownItems) {
      setSelectedSideBar(mainMenu);
    } else {
      setSelectedSideBar(null);
    }
  }, [selectedMenu, sidebarListItems]);

  return (
    <nav className="flex">
      <motion.div
        className={`px-2 py-4 flex flex-col gap-8 h-[100vh] ${
          isCollapsed ? 'bg-cyprus-800' : 'bg-green-0'
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 84 : 240 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`flex ${
            isCollapsed ? 'justify-center' : 'justify-between'
          } items-center`}
        >
          {isCollapsed ? <Home /> : <Building />}
          {!isCollapsed && (
            <div
              className="text-grey-300 hover:text-green-500 cursor-pointer"
              onClick={toggleSidebar}
            >
              <ChevronLeft />
            </div>
          )}
        </div>

        <DisplaySidebarListItems
          items={sidebarListItems}
          selectedItem={selectedMenu}
          onItemClick={handleMainItemClick}
          isCollapsed={isCollapsed}
        />
      </motion.div>

      {selectedSideBar && (
        <motion.div
          className="w-[208px] h-[100vh] bg-green-0 px-2 py-4 flex flex-col gap-5"
          animate={{ width: isCollapsed ? 208 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-bold text-2xl text-gray-900 mt-2 ml-3">
            {selectedSideBar.label}
          </div>

          <DisplaySidebarListItems
            items={selectedSideBar.dropdownItems || []}
            selectedItem={selectedSubMenu}
            onItemClick={handleSubItemClick}
            isCollapsed={isCollapsed}
            type="sidebar"
          />

          {selectedSideBar.subItems && (
            <>
              <div className="h-[1px] bg-gray-200"></div>
              <DisplaySidebarListItems
                items={selectedSideBar.subItems}
                selectedItem={selectedSubMenu}
                onItemClick={handleSubItemClick}
                isCollapsed={isCollapsed}
                type="sidebar"
              />
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
});
