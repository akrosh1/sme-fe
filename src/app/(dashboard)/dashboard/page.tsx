import DashboardComponent from '@/components/dashboard';
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="overflow-y-auto h-screen">
        <DashboardComponent />
      </div>
    </Suspense>
  );
}
