'use client';

import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import capitalize from '@/utils/capitalizeTextCase';

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface PermissionCheckboxProps {
  label: string;
  permissions: Permission[];
  checkedPermissions: Record<string, number>;
  onChange: (id: string, checked: boolean) => void;
}

export function PermissionCheckbox({
  label,
  permissions,
  checkedPermissions,
  onChange,
}: PermissionCheckboxProps) {
  const [parentState, setParentState] = useState<boolean | 'indeterminate'>(
    false,
  );

  const accordionId = `accordion-${label.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    const checkedCount = permissions.filter(
      (perm) => checkedPermissions[perm.id] === 1,
    ).length;

    if (checkedCount === 0) {
      setParentState(false);
    } else if (checkedCount === permissions.length) {
      setParentState(true);
    } else {
      setParentState('indeterminate');
    }
  }, [permissions, checkedPermissions]);

  const handleParentChange = (checked: boolean) => {
    permissions.forEach((perm) => {
      onChange(perm.id, checked);
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={accordionId}
        className="border border-gray-200 bg-gray-50 last:!border-b rounded-lg mb-3"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`parent-${label}`}
                checked={parentState === true}
                data-state={
                  parentState === 'indeterminate'
                    ? 'indeterminate'
                    : parentState
                      ? 'checked'
                      : 'unchecked'
                }
                onCheckedChange={handleParentChange}
                className="h-5 w-5 rounded-sm border-gray-300 data-[state=indeterminate]:bg-blue-400"
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`parent-${label}`}
                className="text-md font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                onClick={(e) => e.stopPropagation()}
              >
                {capitalize(label)}
              </label>
            </div>
            <Badge variant="outline" className="text-xs bg-accent ml-auto mr-4">
              {permissions.length} permissions
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-t-accent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
              >
                <Checkbox
                  id={perm.id}
                  checked={checkedPermissions[perm.id] === 1}
                  onCheckedChange={(checked) => onChange(perm.id, !!checked)}
                  className="h-4 w-4 rounded-sm border-gray-300"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <label
                      htmlFor={perm.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.name}
                    </label>
                    {/* {perm.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              {perm.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
