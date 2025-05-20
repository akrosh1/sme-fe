import RolesList from '@/components/role-permission';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Roles List',
  description: 'List of roles',
};

export default function PermissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RolesList />
    </Suspense>
  );
}
