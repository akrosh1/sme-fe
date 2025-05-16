import { Checkbox } from '@/components/ui/checkbox';

interface Permission {
  [key: string]: string;
}

interface PermissionCheckboxProps {
  label: string;
  permissions: Permission[];
  checkedPermissions: { [key: string]: number };
  onChange: (id: string, checked: boolean) => void;
}

export function PermissionCheckbox({
  label,
  permissions,
  checkedPermissions,
  onChange,
}: PermissionCheckboxProps) {
  const allChecked = permissions.every((perm) => {
    const [id] = Object.keys(perm);
    return checkedPermissions[id] === 1;
  });
  const someChecked = permissions.some((perm) => {
    const [id] = Object.keys(perm);
    return checkedPermissions[id] === 1;
  });

  const handleParentChange = (checked: boolean) => {
    permissions.forEach((perm) => {
      const [id] = Object.keys(perm);
      onChange(id, checked);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={label}
          checked={allChecked}
          onCheckedChange={handleParentChange}
          className={
            someChecked && !allChecked
              ? 'indeterminate !text-grey-0'
              : '!text-grey-0'
          }
        />
        <label
          htmlFor={label}
          className="text-md font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
      <div className="pl-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-3">
        {permissions.map((perm) => {
          const [id, name] = Object.entries(perm)[0];
          return (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={checkedPermissions[id] === 1}
                onCheckedChange={(checked) => onChange(id, checked as boolean)}
                className="!text-grey-0"
              />
              <label
                htmlFor={id}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
