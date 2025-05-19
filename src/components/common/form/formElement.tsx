'use client';

import { CurrencyInput } from '@/components/common/form/currencyInput';
import { PhoneInput } from '@/components/common/form/phoneInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type FormElementProps = {
  text: React.InputHTMLAttributes<HTMLInputElement>;
  email: React.InputHTMLAttributes<HTMLInputElement>;
  tel: React.InputHTMLAttributes<HTMLInputElement>;
  url: React.InputHTMLAttributes<HTMLInputElement>;
  number: React.InputHTMLAttributes<HTMLInputElement> & {
    min?: number;
    max?: number;
  };
  password: React.InputHTMLAttributes<HTMLInputElement>;
  select: {
    value: string | (() => string | undefined) | undefined;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    placeholder?: string;
  };
  checkbox: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };
  switch: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };
  textarea: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  date: {
    value?: Date;
    onChange?: (date?: Date) => void;
  };
  phone: {
    value?: string;
    onChange?: (value: string) => void;
    defaultCountry?: string;
  };
  currency: {
    value?: string;
    onChange?: (value: string) => void;
    currency?: string;
  };
};

export type FormElementsProps<T extends keyof FormElementProps> = {
  type: T;
  name: string;
  label?: string;
  description?: string;
  className?: string;
} & FormElementProps[T];

export function FormElement<T extends keyof FormElementProps>({
  type,
  name,
  label,
  description,
  className,
  ...rest
}: FormElementsProps<T>) {
  const formContext = useFormContext();
  const isFormControlled = !!formContext;
  const error = isFormControlled
    ? (formContext?.formState?.errors[name]?.message as string | undefined)
    : undefined;

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Local state for uncontrolled usage
  const [localDate, setLocalDate] = useState<Date | undefined>(
    (rest as FormElementProps['date']).value,
  );
  const [localValue, setLocalValue] = useState<string | undefined>(
    type === 'select'
      ? (rest as unknown as FormElementProps['select']).value
      : type === 'phone'
        ? (rest as FormElementProps['phone']).value
        : type === 'currency'
          ? (rest as FormElementProps['currency']).value
          : undefined,
  );
  const [localChecked, setLocalChecked] = useState<boolean | undefined>(
    type === 'checkbox'
      ? (rest as FormElementProps['checkbox']).checked
      : type === 'switch'
        ? (rest as FormElementProps['switch']).checked
        : undefined,
  );

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <Input
            id={name}
            type={type}
            {...rest}
            {...(isFormControlled ? formContext?.register(name) : {})}
            className={cn(error && 'border-destructive', className)}
          />
        );
      case 'password':
        if (isFormControlled) {
          return (
            <div className="relative">
              <Input
                id={name}
                type={showPassword ? 'text' : 'password'}
                {...rest}
                {...formContext?.register(name)}
                className={cn(
                  'pr-10',
                  error && 'border-destructive',
                  className,
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        } else {
          return (
            <div className="relative">
              <Input
                id={name}
                type={showPassword ? 'text' : 'password'}
                {...rest}
                className={cn('pr-10', className)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        }
      case 'select':
        const { options, placeholder, onChange, value, ...selectProps } =
          rest as unknown as FormElementProps['select'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                  {...selectProps}
                >
                  <SelectTrigger
                    id={name}
                    className={cn(error && 'border-destructive', className)}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          );
        } else {
          return (
            <Select
              onValueChange={(val) => {
                setLocalValue(val);
                onChange?.(val);
              }}
              value={localValue}
              {...selectProps}
            >
              <SelectTrigger id={name} className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
      case 'checkbox':
        const { checked, onCheckedChange, ...checkboxProps } =
          rest as FormElementProps['checkbox'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  {...checkboxProps}
                  className={className}
                />
              )}
            />
          );
        } else {
          return (
            <Checkbox
              id={name}
              checked={localChecked}
              onCheckedChange={(val) => {
                setLocalChecked(val === true);
                onCheckedChange?.(val === true);
              }}
              {...checkboxProps}
              className={className}
            />
          );
        }
      case 'switch':
        const {
          checked: switchChecked,
          onCheckedChange: switchOnChange,
          ...switchProps
        } = rest as FormElementProps['switch'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <Switch
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  {...switchProps}
                  className={className}
                />
              )}
            />
          );
        } else {
          return (
            <Switch
              id={name}
              checked={localChecked}
              onCheckedChange={(val) => {
                setLocalChecked(val);
                switchOnChange?.(val);
              }}
              {...switchProps}
              className={className}
            />
          );
        }
      case 'textarea':
        return (
          <Textarea
            id={name}
            {...rest}
            {...(isFormControlled ? formContext?.register(name) : {})}
            className={cn(error && 'border-destructive', className)}
          />
        );
      case 'date':
        const { value: dateValue, onChange: dateOnChange } =
          rest as FormElementProps['date'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <Calendar
                  id={name}
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  className={cn(
                    'rounded-md border',
                    error && 'border-destructive',
                    className,
                  )}
                />
              )}
            />
          );
        } else {
          return (
            <Calendar
              id={name}
              mode="single"
              selected={localDate}
              onSelect={(date) => {
                setLocalDate(date);
                dateOnChange?.(date);
              }}
              className={cn('rounded-md border', className)}
            />
          );
        }
      case 'phone':
        const {
          value: phoneValue,
          onChange: phoneOnChange,
          defaultCountry,
        } = rest as FormElementProps['phone'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <PhoneInput
                  id={name}
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry={defaultCountry}
                  className={cn(error && 'border-destructive', className)}
                />
              )}
            />
          );
        } else {
          return (
            <PhoneInput
              id={name}
              value={localValue}
              onChange={(val) => {
                setLocalValue(val);
                phoneOnChange?.(val);
              }}
              defaultCountry={defaultCountry}
              className={className}
            />
          );
        }
      case 'currency':
        const {
          value: currencyValue,
          onChange: currencyOnChange,
          currency,
        } = rest as FormElementProps['currency'];

        if (isFormControlled) {
          return (
            <Controller
              control={formContext.control}
              name={name}
              render={({ field }) => (
                <CurrencyInput
                  id={name}
                  value={field.value}
                  onChange={field.onChange}
                  currency={currency}
                  className={cn(error && 'border-destructive', className)}
                />
              )}
            />
          );
        } else {
          return (
            <CurrencyInput
              id={name}
              value={localValue}
              onChange={(val) => {
                setLocalValue(val);
                currencyOnChange?.(val);
              }}
              currency={currency}
              className={className}
            />
          );
        }
      default:
        return (
          <Input
            id={name}
            {...rest}
            {...(isFormControlled ? formContext?.register(name) : {})}
            className={cn(error && 'border-destructive', className)}
          />
        );
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}
      {renderInput()}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
