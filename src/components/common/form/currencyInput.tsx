'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useEffect, useState } from 'react';

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value?: string;
  onChange?: (value: string) => void;
  currency?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  currency = '$',
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Format the value as currency
  useEffect(() => {
    if (value) {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^\d.]/g, '');

      // Format with currency symbol
      setDisplayValue(`${currency}${numericValue}`);
    } else {
      setDisplayValue('');
    }
  }, [value, currency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract numeric value from input
    const inputValue = e.target.value;

    // Remove currency symbol and any non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^\d.]/g, '');

    // Call onChange with the numeric value only
    onChange?.(numericValue);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={cn('pl-6', className)}
        {...props}
      />
      {!displayValue && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {currency}
        </div>
      )}
    </div>
  );
}
