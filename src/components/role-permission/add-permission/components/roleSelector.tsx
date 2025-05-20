'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Role {
  id: string;
  name: string;
}

interface RoleSelectorProps {
  roles: Role[];
  selectedRole: string;
  onRoleChange: (roleId: string) => void;
  isLoading?: boolean;
}

export function RoleSelector({
  roles,
  selectedRole,
  onRoleChange,
  isLoading = false,
}: RoleSelectorProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="role-select" className="text-sm font-medium">
        Select Role
      </Label>
      <Select
        value={selectedRole}
        onValueChange={onRoleChange}
        disabled={isLoading || roles.length === 0}
      >
        <SelectTrigger id="role-select" className="w-full md:w-[250px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {roles.length === 0 && !isLoading && (
        <p className="text-sm text-red-500">No roles available</p>
      )}
    </div>
  );
}
