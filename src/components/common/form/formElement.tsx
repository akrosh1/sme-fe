'use client';

import { CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CurrencyInput } from '@/components/common/form/currencyInput';
import { PhoneInput } from '@/components/common/form/phoneInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { format } from 'date-fns';

type FormElementProps = {
  text: React.InputHTMLAttributes<HTMLInputElement>;
  email: React.InputHTMLAttributes<HTMLInputElement>;
  tel: React.InputHTMLAttributes<HTMLInputElement>;
  url: React.InputHTMLAttributes<HTMLInputElement>;
  number: React.InputHTMLAttributes<HTMLInputElement> & {
    min?: number;
    max?: number;
  };
  password: React.InputHTMLAttributes<HTMLInputElement> & {
    showEyeIcon?: boolean;
  };
  select: {
    value: string | (() => string | undefined) | undefined;
    options: { value: string; label: string }[];
    onChange?: (value: string) => void;
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
    disabled?: boolean;
  };
  phone: {
    value?: string;
    onChange?: (value: string) => void;
    defaultCountry?: string;
    disabled?: boolean;
  };
  currency: {
    value?: string;
    onChange?: (value: string) => void;
    currency?: string;
  };
};

type FormElementsProps<T extends keyof FormElementProps> = {
  type: T;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
} & FormElementProps[T];

export function FormElement<T extends keyof FormElementProps>({
  type,
  name,
  label,
  description,
  className,
  disabled = false,
  ...rest
}: FormElementsProps<T>) {
  const formContext = useFormContext();
  const isFormControlled = !!formContext;
  const error = isFormControlled
    ? (formContext?.formState?.errors[name]?.message as string | undefined)
    : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );

  const commonProps = useMemo(
    () => ({
      id: name,
      className: cn(
        error && 'border-destructive',
        disabled && 'opacity-70 cursor-not-allowed',
        className,
      ),
      disabled,
      ...rest,
    }),
    [name, error, disabled, className, rest],
  );

  const renderPasswordInput = useCallback(() => {
    const { showEyeIcon = true, ...passwordProps } =
      rest as FormElementProps['password'];

    return (
      <div className="relative">
        <Input
          {...commonProps}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...passwordProps}
          {...(isFormControlled ? formContext?.register(name) : {})}
          className={cn('pr-10', commonProps.className)}
        />
        {showEyeIcon && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  }, [commonProps, showPassword, togglePasswordVisibility, disabled, rest]);

  const renderSelectInput = useCallback(() => {
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
              disabled={disabled}
              {...selectProps}
            >
              <SelectTrigger className={commonProps.className}>
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
    }
  }, [
    isFormControlled,
    formContext?.control,
    name,
    disabled,
    commonProps.className,
    rest,
  ]);

  const renderDateInput = useCallback(() => {
    const { value, onChange, ...dateProps } = rest as FormElementProps['date'];

    if (isFormControlled) {
      return (
        <Controller
          control={formContext.control}
          name={name}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[240px] border-accent justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    commonProps.className,
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      );
    }
  }, [
    isFormControlled,
    formContext?.control,
    name,
    disabled,
    commonProps.className,
    rest,
  ]);

  const renderPhoneInput = useCallback(() => {
    const { defaultCountry, ...phoneProps } = rest as FormElementProps['phone'];

    if (isFormControlled) {
      return (
        <Controller
          control={formContext.control}
          name={name}
          render={({ field }) => (
            <PhoneInput
              {...phoneProps}
              value={field.value}
              onChange={field.onChange}
              defaultCountry={defaultCountry}
              className={commonProps.className}
              disabled={disabled}
            />
          )}
        />
      );
    }
    // Uncontrolled version would go here
  }, [
    isFormControlled,
    formContext?.control,
    name,
    disabled,
    commonProps.className,
    rest,
  ]);

  const renderInput = useCallback(() => {
    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <Input
            type={type}
            {...commonProps}
            {...(isFormControlled ? formContext?.register(name) : {})}
          />
        );
      case 'password':
        return renderPasswordInput();
      case 'select':
        return renderSelectInput();
      case 'checkbox':
        return (
          <Controller
            control={formContext.control}
            name={name}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={className}
                {...(rest as FormElementProps['checkbox'])}
              />
            )}
          />
        );
      case 'switch':
        return (
          <Controller
            control={formContext.control}
            name={name}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={className}
                {...(rest as FormElementProps['switch'])}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            {...(isFormControlled ? formContext?.register(name) : {})}
          />
        );
      case 'date':
        return renderDateInput();
      case 'phone':
        return renderPhoneInput();
      case 'currency':
        return (
          <Controller
            control={formContext.control}
            name={name}
            render={({ field }) => (
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                className={commonProps.className}
                {...(rest as FormElementProps['currency'])}
              />
            )}
          />
        );
      default:
        return (
          <Input
            {...commonProps}
            {...(isFormControlled ? formContext?.register(name) : {})}
          />
        );
    }
  }, [
    type,
    name,
    isFormControlled,
    formContext,
    disabled,
    className,
    rest,
    commonProps,
    renderPasswordInput,
    renderSelectInput,
    renderDateInput,
    renderPhoneInput,
  ]);

  return (
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className={cn('text-sm font-medium', disabled && 'opacity-70')}
        >
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
