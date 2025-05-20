import StaffPermissions from '@/components/role-permission/add-permission';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Assign Permission',
  description: 'Assign a role of Permission',
};

export default function PermissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffPermissions />
    </Suspense>
  );
}
