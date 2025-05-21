'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CameraIcon, Pencil, Save, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useResourceList, useUpdateResource } from '@/hooks/useAPIManagement';
import { cn } from '@/lib/utils';
import upload, { UploadResponse } from '@/utils/uploadFile';
import { FormElement } from '../common/form/formElement';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Schema
const profileFormSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must be at most 254 characters')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .max(255, 'Image URL must be at most 255 characters')
    .optional()
    .or(z.literal('')),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  middle_name: z
    .string()
    .max(50, 'Middle name must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  fullname: z
    .string()
    .max(150, 'Full name must be at most 150 characters')
    .optional()
    .or(z.literal('')),
  phone_number: z
    .string()
    .max(50, 'Phone number must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  gender: z.string().max(20, 'Gender must be at most 20 characters').optional(),
  date_of_birth: z.union([z.string(), z.date()]),
  nationality: z
    .string()
    .max(50, 'Nationality must be at most 50 characters')
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface IProfileResponse {
  id: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  fullname: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  password: string;
  image: string;
}

export function ProfileForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useResourceList<IProfileResponse>(
    '/profiles/info/',
    {
      defaultQuery: { pageIndex: 0, pageSize: 10, search: '' },
    },
  );

  const { mutate: updateProfile, isPending: isCreating } =
    useUpdateResource<ProfileFormValues>(`profiles/${profile?.id}/`, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update profile');
      },
    });

  const defaultValues = useMemo<Partial<ProfileFormValues>>(
    () => ({
      email: profile?.email || '',
      image: profile?.image || '',
      first_name: profile?.first_name || '',
      middle_name: profile?.middle_name || '',
      last_name: profile?.last_name || '',
      fullname: profile?.fullname || '',
      phone_number: profile?.phone_number || '',
      password: profile?.password || '',
      date_of_birth: profile?.date_of_birth || '',
      nationality: profile?.nationality || '',
    }),
    [profile],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (profile) {
      form.reset(defaultValues);
    }
  }, [profile, form, defaultValues]);

  const onSubmit = useCallback(
    async (data: ProfileFormValues) => {
      try {
        const validatedData = profileFormSchema.parse(data);
        const { date_of_birth, ...rest } = validatedData;
        const newData = {
          ...rest,
          date_of_birth: date_of_birth
            ? new Date(date_of_birth).toISOString().split('T')[0]
            : '',
        };
        await updateProfile(newData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Validation errors:', error.errors);
          toast.error('Please fix the validation errors in the form');
        } else {
          toast.error('Failed to update profile');
        }
      }
    },
    [updateProfile],
  );

  const handleUploadProfileImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      upload([file], {
        onChange(f, err) {
          if (err) {
            toast.error('Error uploading image');
          } else {
            toast.success('Image uploaded successfully');
            form.setValue('image', (f as UploadResponse)?.file);
          }
        },
      });
    },
    [form],
  );

  const handleCancel = useCallback(() => {
    form.reset(defaultValues);
    setIsEditing(false);
  }, [form, defaultValues]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const fullName =
    form.watch('fullname') ||
    `${form.watch('first_name')} ${form.watch('last_name')}`;
  const email = form.watch('email');
  const imageSrc = form.watch('image') || 'https://github.com/shadcn.png';

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0 border-none shadow">
        <CardContent className="grid p-0 border-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold mb-5">My Profile</h1>
                    <div className="flex items-center gap-4">
                      <div className="relative border rounded-full">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={imageSrc} alt="Profile" />
                          <AvatarFallback>
                            {fullName?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <>
                            <CameraIcon
                              onClick={handleUploadProfileImage}
                              size={16}
                              className="absolute p-1 bg-gray-200 dark:bg-gray-100 w-6 h-6 rounded-2xl bottom-0 right-0 cursor-pointer"
                            />
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/png,image/jpeg,image/jpg"
                              className="hidden"
                            />
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <div>
                          <p className="font-medium text-xl text-gray-900">
                            {fullName}
                          </p>
                          {email && (
                            <p className="text-muted-foreground">{email}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!form.formState.isValid || isCreating}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormElement
                        type="email"
                        name="email"
                        label="Email"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="password"
                        name="password"
                        label="Password"
                        disabled={!isEditing}
                        autoComplete={isEditing ? 'new-password' : 'off'}
                        showEyeIcon={isEditing}
                      />
                      <FormElement
                        type="text"
                        name="first_name"
                        label="First Name"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="text"
                        name="middle_name"
                        label="Middle Name"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="text"
                        name="last_name"
                        label="Last Name"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="text"
                        name="fullname"
                        label="Full Name"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="phone"
                        name="phone_number"
                        label="Phone Number"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="date"
                        name="date_of_birth"
                        label="Date of Birth"
                        className="w-full"
                        disabled={!isEditing}
                      />
                      <FormElement
                        type="text"
                        name="nationality"
                        label="Nationality"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
