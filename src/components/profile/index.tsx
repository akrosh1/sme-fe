'use client';

import { useUpdateProfileMutation } from '@/api/profileApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CameraIcon, Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Updated schema based on provided specification
const profileFormSchema = z.object({
  alternate_email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must be at most 254 characters')
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
  gender: z
    .enum(['Male', 'Female', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid gender' }),
    })
    .optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  nationality: z
    .string()
    .max(50, 'Nationality must be at most 50 characters')
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Updated default values
const defaultValues: Partial<ProfileFormValues> = {
  alternate_email: 'Rodriguez@gmail.com',
  image: '../images/avatar.png',
  first_name: 'Michael',
  middle_name: '',
  last_name: 'Rodriguez',
  fullname: 'Michael Rodriguez',
  phone_number: '(213) 555-1234',
  gender: undefined,
  date_of_birth: '',
  nationality: 'American',
};

export function ProfileForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile(data).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  }

  const handleUploadProfileImage = () => {
    // Simulate file upload (replace with actual file upload logic)
    const newImageUrl = prompt('Enter image URL:'); // For demo; use proper file input in production
    if (newImageUrl) {
      form.setValue('image', newImageUrl, { shouldValidate: true });
    }
  };

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
                          <AvatarImage
                            src={
                              form.watch('image') ||
                              'https://github.com/shadcn.png'
                            }
                            alt="Profile"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <CameraIcon
                            onClick={handleUploadProfileImage}
                            size={16}
                            className="absolute p-1 bg-gray-200 dark:bg-gray-100 w-6 h-6 rounded-2xl bottom-0 right-0 cursor-pointer"
                          />
                        )}
                      </div>
                      {!isEditing && (
                        <div>
                          <p className="font-medium text-xl text-gray-900">
                            {form.watch('fullname') ||
                              `${form.watch('first_name')} ${form.watch('last_name')}`}
                          </p>
                          <p className="text-muted-foreground">
                            {form.watch('nationality') || 'Not specified'}
                          </p>
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
                        onClick={() => {
                          form.reset();
                          setIsEditing(false);
                        }}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!form.formState.isValid || isLoading}
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
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="middle_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="alternate_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alternate Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                                type="date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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
