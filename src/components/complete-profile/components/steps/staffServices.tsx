'use client';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/useDispatch';
import {
  setCurrentStep,
  updateStaffServices,
} from '@/store/slices/completeProfileSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const staffServicesSchema = z.object({
  totalEmployees: z.string().min(1, 'Total employees is required'),
  fullTimeEmployees: z.string().min(1, 'Full-time employees is required'),
  partTimeEmployees: z.string().min(1, 'Part-time employees is required'),
  contractors: z.string().min(1, 'Number of contractors is required'),
  primaryServices: z
    .array(z.string())
    .min(1, 'Please select at least one service'),
  targetMarket: z.string().min(10, 'Please describe your target market'),
  serviceAreas: z
    .array(z.string())
    .min(1, 'Please select at least one service area'),
});

type StaffServicesForm = z.infer<typeof staffServicesSchema>;

const serviceOptions = [
  'Consulting',
  'Software Development',
  'Digital Marketing',
  'Design Services',
  'Data Analytics',
  'Cloud Services',
  'Cybersecurity',
  'Training & Education',
  'Support Services',
  'Other',
];

const serviceAreaOptions = [
  'Local',
  'Regional',
  'National',
  'International',
  'Online/Remote',
];

export function StaffServices() {
  const dispatch = useAppDispatch();
  const staffServices = useAppSelector((state) => state.form.staffServices);

  const form = useForm<StaffServicesForm>({
    resolver: zodResolver(staffServicesSchema),
    defaultValues: staffServices,
  });

  const onSubmit = (data: StaffServicesForm) => {
    dispatch(updateStaffServices(data));
    dispatch(setCurrentStep(5));
  };

  const onBack = () => {
    dispatch(setCurrentStep(3));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Tell us about your team size and the services you provide
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Employees *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter total number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullTimeEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full-Time Employees *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="partTimeEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part-Time Employees *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractors *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="primaryServices"
            render={() => (
              <FormItem>
                <FormLabel>Primary Services *</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="primaryServices"
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
            name="targetMarket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Market *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your target market and ideal customers"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceAreas"
            render={() => (
              <FormItem>
                <FormLabel>Service Areas *</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceAreaOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="serviceAreas"
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
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
