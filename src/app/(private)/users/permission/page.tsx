import StaffPermissions from '@/components/role-permission';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Permission',
  description: 'List of Permission',
};

export default function PermissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffPermissions />
    </Suspense>
  );
}
