'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormElement } from '../form/formElement';

export interface ModalFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface ModalConfig<T extends FieldValues> {
  type: 'add' | 'edit';
  open: boolean;
  title: string;
  fields: ModalFieldConfig[];
  initialData?: Partial<T>;
}

export interface ModalState<T extends FieldValues> {
  open: boolean;
  type: 'add' | 'edit';
  data?: Partial<T>;
}

interface DynamicModalProps<T extends FieldValues> {
  config: ModalConfig<T>;
  onSubmit: (data: T) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function DynamicModal<T extends FieldValues>({
  config,
  onSubmit,
  onClose,
  isLoading = false,
}: DynamicModalProps<T>) {
  const createDynamicSchema = () => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};

    config.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'number':
          fieldSchema = z
            .number()
            .min(0, `${field.label} must be a positive number`);
          break;
        case 'textarea':
          fieldSchema = z.string().min(1, `${field.label} is required`);
          break;
        case 'select':
          fieldSchema = z.string().min(1, `${field.label} is required`);
          break;
        default:
          fieldSchema = z.string().min(1, `${field.label} is required`);
      }

      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }

      schemaShape[field.name] = fieldSchema;
    });

    return z.object(schemaShape);
  };

  const form = useForm<T>({
    resolver: zodResolver(createDynamicSchema()),
    defaultValues: config.initialData || {},
  });

  console.log('DynamicModal initialData:', config.initialData);
  console.log('DynamicModal form values:', form.getValues());

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Dialog
      open={config.open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {config.fields.map((field) => (
              <FormElement
                key={field.name}
                name={field.name}
                type={field.type}
                options={field.options}
                label={field.label}
                placeholder={field.placeholder}
              />
            ))}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
