// import { Checkbox } from '@/components/ui/checkbox';

// interface Permission {
//   [key: string]: string;
// }

// interface PermissionCheckboxProps {
//   label: string;
//   permissions: Permission[];
//   checkedPermissions: { [key: string]: number };
//   onChange: (id: string, checked: boolean) => void;
// }

// export function PermissionCheckbox({
//   label,
//   permissions,
//   checkedPermissions,
//   onChange,
// }: PermissionCheckboxProps) {
//   const allChecked = permissions.every((perm) => {
//     const [id] = Object.keys(perm);
//     return checkedPermissions[id] === 1;
//   });
//   const someChecked = permissions.some((perm) => {
//     const [id] = Object.keys(perm);
//     return checkedPermissions[id] === 1;
//   });

//   const handleParentChange = (checked: boolean) => {
//     permissions.forEach((perm) => {
//       const [id] = Object.keys(perm);
//       onChange(id, checked);
//     });
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center space-x-2">
//         <Checkbox
//           id={label}
//           checked={allChecked}
//           onCheckedChange={handleParentChange}
//           className={
//             someChecked && !allChecked
//               ? 'indeterminate !text-grey-0'
//               : '!text-grey-0'
//           }
//         />
//         <label
//           htmlFor={label}
//           className="text-md font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//         >
//           {label}
//         </label>
//       </div>
//       <div className="pl-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-3">
//         {permissions.map((perm) => {
//           const [id, name] = Object.entries(perm)[0];
//           return (
//             <div key={id} className="flex items-center space-x-2">
//               <Checkbox
//                 id={id}
//                 checked={checkedPermissions[id] === 1}
//                 onCheckedChange={(checked) => onChange(id, checked as boolean)}
//                 className="!text-grey-0"
//               />
//               <label
//                 htmlFor={id}
//                 className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 {name}
//               </label>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Represents a single permission with an ID and name
 */
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

/**
 * Props for the PermissionCheckbox component
 */
export interface PermissionCheckboxProps {
  /** Category or group label for the permissions */
  label: string;

  /** Array of permissions in this group */
  permissions: Permission[];

  /** Object mapping permission IDs to their status (1 = checked, 0 = unchecked) */
  checkedPermissions: Record<string, number>;

  /** Callback when a permission is toggled */
  onChange: (id: string, checked: boolean) => void;
}

export function PermissionCheckbox({
  label,
  permissions,
  checkedPermissions,
  onChange,
}: PermissionCheckboxProps) {
  // Track parent checkbox state
  const [parentState, setParentState] = useState<boolean | 'indeterminate'>(
    false,
  );

  // Update parent checkbox state whenever checked permissions change
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

  // Handle parent checkbox change
  const handleParentChange = (checked: boolean) => {
    permissions.forEach((perm) => {
      onChange(perm.id, checked);
    });
  };

  return (
    <div className="space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`parent-${label}`}
            checked={parentState === true}
            // indeterminate={parentState === 'indeterminate'}
            onCheckedChange={handleParentChange}
            className="h-5 w-5 rounded-sm border-gray-300 data-[state=indeterminate]:bg-blue-400"
          />
          <label
            htmlFor={`parent-${label}`}
            className="text-md font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
        <Badge variant="outline" className="text-xs">
          {permissions.length} permissions
        </Badge>
      </div>
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
                {perm.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{perm.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
