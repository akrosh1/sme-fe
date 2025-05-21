'use client';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import CustomDateSelector, {
  IDateFilter,
} from '../common/form/customDateSelector';
import { MetricsCard } from './metricsCard';
import { StatsChart } from './statsCard';
import DataTableDemo from './table';

const METRICS = [
  {
    title: 'Your Balance',
    value: '$74,892',
    change: { value: '$1,340', percentage: '-2.1%', isPositive: false },
  },
  {
    title: 'Your Deposits',
    value: '$54,892',
    change: { value: '$1,340', percentage: '+13.2%', isPositive: true },
  },
  {
    title: 'Accrued Yield',
    value: '$20,892',
    change: { value: '$1,340', percentage: '+1.2%', isPositive: true },
  },
];

interface IFilterData {
  date: string;
  fromDate: string;
  toDate: string;
  agent: string;
  limit: number;
  page: number;
}

export default function DashboardComponent() {
  const [filterData, setFilterData] = useState<IFilterData>({
    date: 'today',
    fromDate: '',
    toDate: '',
    agent: '',
    limit: 10,
    page: 1,
  });
  console.log('🚀 ~ DashboardComponent ~ filterData:', filterData);

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>
        <CustomDateSelector
          date={filterData}
          onDateChange={(newDate: IDateFilter) => {
            setFilterData((previousData: any) => {
              return {
                ...previousData,
                date: newDate.date,
                fromDate: newDate.fromDate,
                toDate: newDate.toDate,
              };
            });
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {METRICS.map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>

      <Card className="mt-6 p-6 border-0">
        <StatsChart />
      </Card>

      <div className="mt-6">
        <DataTableDemo />
      </div>
    </div>
  );
}
