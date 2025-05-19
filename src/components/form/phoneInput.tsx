'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useEffect, useState } from 'react';

// Common country codes with flags
const countryCodes = [
  { code: 'us', label: '🇺🇸 +1', prefix: '+1' },
  { code: 'gb', label: '🇬🇧 +44', prefix: '+44' },
  { code: 'ca', label: '🇨🇦 +1', prefix: '+1' },
  { code: 'au', label: '🇦🇺 +61', prefix: '+61' },
  { code: 'de', label: '🇩🇪 +49', prefix: '+49' },
  { code: 'fr', label: '🇫🇷 +33', prefix: '+33' },
  { code: 'jp', label: '🇯🇵 +81', prefix: '+81' },
  { code: 'cn', label: '🇨🇳 +86', prefix: '+86' },
  { code: 'in', label: '🇮🇳 +91', prefix: '+91' },
];

interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = 'us',
  className,
  ...props
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialize from value prop if provided
  useEffect(() => {
    if (value) {
      // Try to extract country code and number
      const countryCode = countryCodes.find((c) => value.startsWith(c.prefix));

      if (countryCode) {
        setSelectedCountry(countryCode.code);
        setPhoneNumber(value.substring(countryCode.prefix.length).trim());
      } else {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  // Get the current country prefix
  const getCountryPrefix = () => {
    return countryCodes.find((c) => c.code === selectedCountry)?.prefix || '';
  };

  // Handle country change
  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    const newValue =
      `${countryCodes.find((c) => c.code === code)?.prefix || ''} ${phoneNumber}`.trim();
    onChange?.(newValue);
  };

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);

    // Format the full number with country code
    const newValue = `${getCountryPrefix()} ${newPhoneNumber}`.trim();
    onChange?.(newValue);
  };

  return (
    <div className="flex gap-2">
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[110px] flex-shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className={cn('flex-grow', className)}
        placeholder="Phone number"
        {...props}
      />
    </div>
  );
}
