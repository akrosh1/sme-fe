'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { ChevronDown, X } from 'lucide-react';
import * as React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FancyMultiSelectProps {
  name?: string;
  className?: string;
  label?: string;
  value?: string[];
  options: Option[];
  placeholder?: string;
  onChange?: (value: string[]) => void;
}

export function FancyMultiSelect({
  name,
  className = 'w-full',
  label,
  value = [],
  options,
  placeholder = 'Select options...',
  onChange,
}: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<Option[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');

  // Sync selected state with value prop
  React.useEffect(() => {
    const newSelected = options.filter((option) =>
      value.includes(option.value),
    );
    setSelected(newSelected);
  }, [value, options]);

  const handleUnselect = React.useCallback(
    (framework: Option) => {
      const newSelected = selected.filter((s) => s.value !== framework.value);
      setSelected(newSelected);
      onChange?.(newSelected.map((item) => item.value)); // Call onChange directly
    },
    [selected, onChange],
  );

  const handleSelect = React.useCallback(
    (framework: Option) => {
      const newSelected = [...selected, framework];
      setSelected(newSelected);
      setInputValue('');
      onChange?.(newSelected.map((item) => item.value)); // Call onChange directly
    },
    [selected, onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            const newSelected = [...selected];
            const removed = newSelected.pop();
            setSelected(newSelected);
            if (removed) {
              onChange?.(newSelected.map((item) => item.value)); // Call onChange on delete
            }
          }
        }
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [selected, onChange],
  );

  const selectables = options.filter(
    (option) => !selected.some((s) => s.value === option.value),
  );

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block w-fit text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input px-3 py-1.75 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1 items-center relative pr-4">
            {selected.map((framework) => (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                  type="button"
                >
                  <X className="h-3 w-3  text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={inputRef}
              name={name}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground placeholder:w-fit"
            />
            <ChevronDown className="ml-1 h-4 w-4 absolute right-0 top-1 shrink-0 opacity-50" />
          </div>
        </div>
        <div className="relative">
          <CommandList>
            {open && selectables.length > 0 && (
              <div className="absolute mt-2 top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(framework)}
                      className="cursor-pointer"
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            )}
          </CommandList>
        </div>
      </Command>
    </div>
  );
}
