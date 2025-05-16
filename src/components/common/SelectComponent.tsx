import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React from 'react';

export interface SelectOption {
  value?: string;
  label?: string;
}

interface SelectComponentProps {
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'outlined' | 'standard';
  icon?: React.ReactNode;
  value?: string;
  isOpen?: boolean;
  className?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  placeholder = 'Select an option',
  defaultValue,
  onValueChange,
  variant = 'standard',
  icon,
  value,
  disabled = false,
  isOpen,
  className,
  onOpenChange,
}) => {
  return (
    <Select
      open={isOpen}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          className,
          `w-fit dark:bg-grey-800 dark:text-white ${
            variant === 'outlined' ? 'dark:border-[#eee]' : 'border-none'
          }`,
        )}
      >
        {icon}
        <SelectValue placeholder={placeholder} className={icon ? 'ml-2' : ''} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          className,
          `w-[200px] bg-white dark:bg-grey-800 dark:text-white `,
        )}
      >
        <SelectGroup className="bg-white dark:bg-black">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value || ''}
              className="text-red-50 dark:bg-gray-700 dark:text-white my-1"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
