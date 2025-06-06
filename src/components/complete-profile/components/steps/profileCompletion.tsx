'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/useDispatch';
import {
  completeForm,
  setCurrentStep,
  updateProfileCompletion,
} from '@/store/slices/completeProfileSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileCompletionSchema = z.object({
  businessLogo: z.string().optional(),
  socialMediaLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  }),
  marketingPreferences: z.array(z.string()).optional(),
  communicationPreferences: z.array(z.string()).optional(),
});

type ProfileCompletionForm = z.infer<typeof profileCompletionSchema>;

const marketingOptions = [
  'Email Marketing',
  'Social Media Updates',
  'Industry News',
  'Product Updates',
  'Event Invitations',
];

const communicationOptions = ['Email', 'SMS', 'Phone', 'In-App Notifications'];

export function ProfileCompletion() {
  const dispatch = useAppDispatch();
  const profileCompletion = useAppSelector(
    (state) => state.form.profileCompletion,
  );
  const isCompleted = useAppSelector((state) => state.form.isCompleted);

  const form = useForm<ProfileCompletionForm>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: profileCompletion,
  });

  const onSubmit = (data: ProfileCompletionForm) => {
    dispatch(updateProfileCompletion(data as any));
    dispatch(completeForm());
  };

  const onBack = () => {
    dispatch(setCurrentStep(4));
  };

  if (isCompleted) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            Profile Complete!
          </h2>
          <p className="text-muted-foreground mt-2">
            Thank you for completing your business profile. Your information has
            been saved successfully.
          </p>
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Your profile will be reviewed within 24-48 hours</p>
            <p>• You'll receive a confirmation email shortly</p>
            <p>• Access to premium features will be activated</p>
            <p>• Our team may contact you for additional verification</p>
          </CardContent>
        </Card>
        <Button onClick={() => window.location.reload()} className="px-8">
          Start New Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Add final touches to your business profile (optional)
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="socialMediaLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMediaLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMediaLinks.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMediaLinks.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="marketingPreferences"
            render={() => (
              <FormItem>
                <FormLabel>Marketing Preferences</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {marketingOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="marketingPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communicationPreferences"
            render={() => (
              <FormItem>
                <FormLabel>Communication Preferences</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {communicationOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="communicationPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="px-8">
              Complete Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
