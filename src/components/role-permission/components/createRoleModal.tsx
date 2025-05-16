'use client';

// import { createRoles } from '@/apis/settings/settings';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface IAddRoleProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddRolesPopup({ open, setOpen }: IAddRoleProps) {
  const queryClient = useQueryClient();
  //   const [isOpen, setOpen] = useState(false)
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  const { mutate: createRoleMutation, isPending } = useMutation({
    mutationFn: createRoles,
    mutationKey: ['create-roles'],
    onSuccess: (response) => {
      toast.success('Succesfully created role');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['get-roles-data'] });
    },
  });

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    createRoleMutation({ name: roleName, description: roleDescription });
    setRoleName('');
    setRoleDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Roles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateRole} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button type="submit" className="ml-auto">
            Create Role
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
