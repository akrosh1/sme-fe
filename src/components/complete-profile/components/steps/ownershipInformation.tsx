'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/useDispatch';
import {
  setCurrentStep,
  updateOwnershipInfo,
} from '@/store/slices/completeProfileSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const ownershipSchema = z.object({
  ownershipType: z.string().min(1, 'Please select ownership type'),
  numberOfOwners: z.string().min(1, 'Please specify number of owners'),
  keyPersonnel: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        position: z.string().min(1, 'Position is required'),
        experience: z.string().min(1, 'Experience is required'),
      }),
    )
    .min(1, 'At least one key personnel is required'),
  boardMembers: z.string().optional(),
  advisors: z.string().optional(),
});

type OwnershipForm = z.infer<typeof ownershipSchema>;

export function OwnershipInformation() {
  const dispatch = useAppDispatch();
  const ownershipInfo = useAppSelector((state) => state.form.ownershipInfo);

  const form = useForm<OwnershipForm>({
    resolver: zodResolver(ownershipSchema),
    defaultValues: {
      ...ownershipInfo,
      keyPersonnel:
        ownershipInfo.keyPersonnel.length > 0
          ? ownershipInfo.keyPersonnel
          : [{ name: '', position: '', experience: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'keyPersonnel',
  });

  const onSubmit = (data: OwnershipForm) => {
    dispatch(updateOwnershipInfo(data));
    dispatch(setCurrentStep(4));
  };

  const onBack = () => {
    dispatch(setCurrentStep(2));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Provide information about ownership structure and key team members
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ownershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ownership Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sole">Sole Ownership</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="family">Family Owned</SelectItem>
                      <SelectItem value="public">Publicly Traded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfOwners"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Owners *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2-5">2-5</SelectItem>
                      <SelectItem value="6-10">6-10</SelectItem>
                      <SelectItem value="10+">10+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Key Personnel *</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ name: '', position: '', experience: '' })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`keyPersonnel.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyPersonnel.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyPersonnel.${index}.experience`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="Years of experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="boardMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Members</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List board members and their roles (optional)"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="advisors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advisors</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List key advisors and their expertise (optional)"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
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
