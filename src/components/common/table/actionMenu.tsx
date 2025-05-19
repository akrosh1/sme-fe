import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

interface Action {
  label: string;
  onClick: (id: string) => void;
  variant?: 'default' | 'danger' | 'ghost';
}

interface ActionMenuProps {
  id: string;
  actions: Action[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ id, actions }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(id)}
            className={
              action.variant === 'danger'
                ? 'text-red-600 hover:bg-red-100'
                : action.variant === 'ghost'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : ''
            }
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
