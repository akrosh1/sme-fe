'use client';

import { FormElement } from '@/components/common/form/formElement';
import PageHeader from '@/components/common/PageHeader';
import { TiptapEditor } from '@/components/common/richTextEditor/tiptapEditor';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateResource, useUpdateResource } from '@/hooks/useAPIManagement';
import useFetch from '@/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  is_active: z.union([z.boolean(), z.string()]),
});

type CMSFormValues = z.infer<typeof formSchema>;
export function CMSForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cmsId = searchParams.get('id');

  const { data: user, isLoading } = useFetch<
    'get',
    { id: string },
    CMSFormValues
  >(`cms-pages/${cmsId}`, 'get', {
    enabled: !!cmsId,
    //  @ts-expect-error will be fixed later
    onError: (error: AxiosError) => {
      console.error(`Failed to fetch user with ID ${cmsId}:`, error?.message);
    },
    select: (data: { data: CMSFormValues }) => data.data,
  });

  const initialValues: CMSFormValues = {
    id: user?.id || 0,
    title: user?.title || '',
    content: user?.content || '',
    is_active: user?.is_active ? 'true' : 'false',
  };
  console.log('🚀 ~ CMSForm ~ initialValues:', initialValues);

  const form = useForm<CMSFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...initialValues,
      });
    }
  }, [user, form]);

  const { mutate: createUser, isPending: isCreating } =
    useCreateResource<CMSFormValues>('cms-pages/', {
      onSuccess: () => {
        toast.success('CMS created successfully');
        router.push('/cms');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create user');
      },
    });

  const { mutate: updateUser, isPending: isUpdating } =
    useUpdateResource<CMSFormValues>(`cms-pages/${cmsId}`, {
      onSuccess: () => {
        toast.success('CMS updated successfully');
        router.push('/cms');
        form.reset(initialValues);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update user');
      },
    });

  const isSubmitting = isCreating || isUpdating;
  const onSubmit = (values: CMSFormValues) => {
    const { id, is_active, ...data } = values;
    const transformedData = {
      ...data,
      is_active: is_active === 'true' ? true : false,
    };
    if (cmsId) {
      updateUser(transformedData);
    } else {
      createUser(transformedData);
    }
  };

  const handleCancelForm = () => {
    form.reset(initialValues);
  };

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'InActive' },
  ];

  return (
    <Form {...form}>
      <PageHeader title="Add CMS Page" actionText="Back" actionPath="/cms" />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 wrapper"
      >
        <FormElement label="Title" type="text" name="title" />
        <FormElement label="Content" type="textarea" name="content" />

        <TiptapEditor
          content={initialValues.content}
          onChange={(content) => form.setValue('content', content)}
          placeholder="Start typing..."
        />

        <FormElement
          label="Status"
          options={statusOptions}
          onChange={(value) => form.setValue('is_active', value)}
          value={initialValues.is_active as string}
          placeholder="select"
          type="select"
          name="is_active"
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelForm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialValues.id ? 'Updating...' : 'Creating...'}
              </>
            ) : initialValues.id ? (
              'Update CMS'
            ) : (
              'Create CMS'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
