// 'use client';

// import { FileUpload } from '@/components/common/form/fileUploads';
// import { FormElement } from '@/components/common/form/formElement';
// import { FormButtonGroup } from '@/components/common/form/submitButton';
// import PageHeader from '@/components/common/PageHeader';
// import { TiptapEditor } from '@/components/common/richTextEditor/tiptapEditor';
// import { Form } from '@/components/ui/form';
// import { useCreateResource, useUpdateResource } from '@/hooks/useAPIManagement';
// import useFetch from '@/hooks/useFetch';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { AxiosError } from 'axios';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import * as z from 'zod';
// import { TagsInput } from '../components/tagsInput';

// const formSchema = z.object({
//   id: z.number().optional(),
//   title: z.string().min(1, 'Title is required'),
//   body: z.string().min(1, 'Body is required'),
//   tags: z.array(z.string()).default([]),
//   medias: z.array(z.string()).default([]),
//   category: z.string().min(1, 'Category is required'),
//   is_active: z.union([z.boolean(), z.string()]),
// });

// type ArticleFormValues = z.infer<typeof formSchema>;

// export function ArticleForm() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const articleId = searchParams.get('articleId');
//   const [mediaUrls, setMediaUrls] = useState<string[]>([]);
//   console.log('🚀 ~ ArticleForm ~ mediaUrls:', mediaUrls);

//   const { data: user, isLoading } = useFetch<
//     'get',
//     { id: string },
//     ArticleFormValues
//   >(`articles/${articleId}`, 'get', {
//     enabled: !!articleId,
//     onError: (error: AxiosError) => {
//       console.error(
//         `Failed to fetch article with ID ${articleId}:`,
//         error?.message,
//       );
//     },
//     select: (data: { data: ArticleFormValues }) => data.data,
//   });

//   // Initialize form with default values
//   const form = useForm<ArticleFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       id: user?.id || 0,
//       title: user?.title || '',
//       body: user?.body || '',
//       medias: user?.medias || [],
//       tags: user?.tags || [],
//       category: user?.category || '',
//       is_active: user?.is_active ? 'true' : 'false',
//     },
//     mode: 'onChange',
//   });

//   // Sync form with fetched user data and mediaUrls
//   useEffect(() => {
//     if (user) {
//       const updatedMediaUrls = user.medias || [];
//       setMediaUrls(updatedMediaUrls);
//       form.reset({
//         id: user.id || 0,
//         title: user.title || '',
//         body: user.body || '',
//         medias: updatedMediaUrls,
//         tags: user.tags || [],
//         category: user.category || '',
//         is_active: user.is_active ? 'true' : 'false',
//       });
//     }
//   }, [user, form]);

//   const { mutate: createUser, isPending: isCreating } =
//     useCreateResource<ArticleFormValues>('articles/', {
//       onSuccess: () => {
//         toast.success('Article created successfully');
//         router.push('/articles');
//       },
//       onError: (error) => {
//         toast.error(error?.message || 'Failed to create article');
//       },
//     });

//   const { mutate: updateUser, isPending: isUpdating } =
//     useUpdateResource<ArticleFormValues>(`articles/${articleId}`, {
//       onSuccess: () => {
//         toast.success('Article updated successfully');
//         router.push('/articles');
//       },
//       onError: (error) => {
//         toast.error(error?.message || 'Failed to update article');
//       },
//     });

//   const isSubmitting = isCreating || isUpdating;

//   const onSubmit = (values: ArticleFormValues) => {
//     const { id, is_active, ...data } = values;

//     const transformedData = {
//       ...data,
//       is_active: is_active === 'true',
//       medias: values.medias || [], // Use form's medias field
//     };

//     if (articleId) {
//       updateUser(transformedData);
//     } else {
//       createUser(transformedData);
//     }
//     console.log('🚀 ~ onSubmit ~ transformedData:', transformedData);
//   };

//   const handleCancelForm = () => {
//     form.reset({
//       id: user?.id || 0,
//       title: user?.title || '',
//       body: user?.body || '',
//       medias: user?.medias || mediaUrls,
//       tags: user?.tags || [],
//       category: user?.category || '',
//       is_active: user?.is_active ? 'true' : 'false',
//     });
//   };

//   const statusOptions = [
//     { value: 'true', label: 'Active' },
//     { value: 'false', label: 'InActive' },
//   ];

//   return (
//     <Form {...form}>
//       <PageHeader
//         title={articleId ? 'Edit Article' : 'Add Article'}
//         actionText="Back"
//         actionPath="/articles"
//       />
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4 wrapper"
//       >
//         <FormElement label="Title" type="text" name="title" />

//         <label htmlFor="body">Content</label>
//         <TiptapEditor
//           content={form.getValues('body')}
//           onChange={(content) => form.setValue('body', content)}
//           placeholder="Start typing..."
//         />

//         <TagsInput
//           onTagsChange={(value) => form.setValue('tags', value)}
//           tags={form.getValues('tags')}
//           maxTags={5}
//           inputClassName="col-span-2"
//         />

//         <FormElement
//           name="category"
//           type="select"
//           label="Category"
//           className="w-full"
//           value={form.getValues('category')}
//           onChange={(value) => form.setValue('category', value)}
//           options={[
//             { value: 'news', label: 'News' },
//             { value: 'blog', label: 'Blog' },
//           ]}
//         />

//         <FileUpload
//           accept="image/*,video/*"
//           multiple={true}
//           onUploadComplete={(responses) => {
//             const urls = responses?.map((r) => r.file) || [];
//             console.log('🚀 ~ ArticleForm ~ urls:', urls);
//             setMediaUrls(urls); // Update mediaUrls state
//             form.setValue('medias', urls); // Update form's medias field
//           }}
//         />

//         <FormElement
//           label="Status"
//           className="w-full"
//           options={statusOptions}
//           onChange={(value) => form.setValue('is_active', value)}
//           value={form.getValues('is_active') as string}
//           placeholder="select"
//           type="select"
//           name="is_active"
//         />

//         <FormButtonGroup
//           isSubmitting={isSubmitting}
//           mode={articleId ? 'edit' : 'create'}
//           cancel={{
//             onClick: handleCancelForm,
//             text: 'Discard Changes',
//           }}
//           submitText={{
//             create: 'Create Article',
//             edit: 'Update Article',
//           }}
//           submitLoadingText={{
//             create: 'Creating Article...',
//             edit: 'Updating Article...',
//           }}
//         />
//       </form>
//     </Form>
//   );
// }

'use client';

import { FileUpload } from '@/components/common/form/fileUploads';
import { FormElement } from '@/components/common/form/formElement';
import { FormButtonGroup } from '@/components/common/form/submitButton';
import PageHeader from '@/components/common/PageHeader';
import { TiptapEditor } from '@/components/common/richTextEditor/tiptapEditor';
import { Form } from '@/components/ui/form';
import { useCreateResource, useUpdateResource } from '@/hooks/useAPIManagement';
import useFetch from '@/hooks/useFetch';
import { UploadResponse } from '@/utils/uploadFile';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { TagsInput } from '../components/tagsInput';

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  tags: z.array(z.string()).default([]),
  medias: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  is_active: z.union([z.boolean(), z.string()]),
});

type ArticleFormValues = z.infer<typeof formSchema>;

export function ArticleForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleId = searchParams.get('articleId');
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
  console.log('🚀 ~ ArticleForm ~ uploadedFiles:', uploadedFiles);

  const { data: articleData, isLoading } = useFetch<
    'get',
    { id: string },
    ArticleFormValues
  >(`articles/${articleId}`, 'get', {
    enabled: !!articleId,
    onError: (error: AxiosError) => {
      console.error(
        `Failed to fetch article with ID ${articleId}:`,
        error?.message,
      );
    },
    select: (data: { data: ArticleFormValues }) => data.data,
  });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      title: '',
      body: '',
      medias: [],
      tags: [],
      category: '',
      is_active: 'true',
    },
    mode: 'onChange',
  });

  // Initialize form with fetched data
  useEffect(() => {
    if (articleData) {
      form.reset({
        ...articleData,
        is_active: articleData.is_active ? 'true' : 'false',
      });
      setUploadedFiles(
        articleData.medias?.map((url) => ({ file: id }) as UploadResponse) ||
          [],
      );
    }
  }, [articleData, form]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      form.setValue(
        'medias',
        uploadedFiles.map((f) => f.id),
      );
    }
  }, [uploadedFiles]);
  console.log('🚀 ~ ArticleForm ~ form:', form.getValues());

  const { mutate: createArticle, isPending: isCreating } =
    useCreateResource<ArticleFormValues>('articles/', {
      onSuccess: () => {
        toast.success('Article created successfully');
        router.push('/articles');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create article');
      },
    });

  const { mutate: updateArticle, isPending: isUpdating } =
    useUpdateResource<ArticleFormValues>(`articles/${articleId}`, {
      onSuccess: () => {
        toast.success('Article updated successfully');
        router.push('/articles');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update article');
      },
    });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (values: ArticleFormValues) => {
    const { id, is_active, ...data } = values;

    const transformedData = {
      ...data,
      is_active: is_active === 'true',
      medias: uploadedFiles.map((file) => file.file),
    };

    if (articleId) {
      updateArticle(transformedData);
    } else {
      createArticle(transformedData);
    }
  };

  const handleCancelForm = () => {
    if (articleData) {
      form.reset({
        ...articleData,
        is_active: articleData.is_active ? 'true' : 'false',
      });
      setUploadedFiles(
        articleData.medias?.map((url) => ({ file: url }) as UploadResponse) ||
          [],
      );
    } else {
      form.reset();
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (responses: UploadResponse[] | null) => {
    console.log('🚀 ~ handleFileUpload ~ responses:', responses);
    if (responses && responses.length > 0) {
      setUploadedFiles((prev) => [...prev, ...responses]);
      form.setValue('medias', [
        ...form.getValues('medias'),
        ...responses.map((r) => r.file),
      ]);
    }
  };

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'InActive' },
  ];

  return (
    <Form {...form}>
      <PageHeader
        title={articleId ? 'Edit Article' : 'Add Article'}
        actionText="Back"
        actionPath="/articles"
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 wrapper"
      >
        <FormElement label="Title" type="text" name="title" />

        <label htmlFor="body">Content</label>
        <TiptapEditor
          content={form.getValues('body')}
          onChange={(content) => form.setValue('body', content)}
          placeholder="Start typing..."
        />

        <TagsInput
          onTagsChange={(value) => form.setValue('tags', value)}
          tags={form.getValues('tags')}
          maxTags={5}
          inputClassName="col-span-2"
        />

        <FormElement
          name="category"
          type="select"
          label="Category"
          className="w-full"
          value={form.getValues('category')}
          onChange={(value) => form.setValue('category', value)}
          options={[
            { value: 'news', label: 'News' },
            { value: 'blog', label: 'Blog' },
          ]}
        />

        <FileUpload
          accept="image/*,video/*"
          multiple={true}
          onUploadComplete={handleFileUpload}
        />

        <FormElement
          label="Status"
          className="w-full"
          options={statusOptions}
          onChange={(value) => form.setValue('is_active', value)}
          value={form.getValues('is_active') as string}
          placeholder="select"
          type="select"
          name="is_active"
        />

        <FormButtonGroup
          isSubmitting={isSubmitting}
          mode={articleId ? 'edit' : 'create'}
          cancel={{
            onClick: handleCancelForm,
            text: 'Discard Changes',
          }}
          submitText={{
            create: 'Create Article',
            edit: 'Update Article',
          }}
          submitLoadingText={{
            create: 'Creating Article...',
            edit: 'Updating Article...',
          }}
        />
      </form>
    </Form>
  );
}
