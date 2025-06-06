'use client';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Footer } from '../common/Footer';
import { Badge } from '../ui/badge';
import NewsAndEvents from './newsAndEvents';
import { PublicHeader } from './publicHeader';
import ServicesSection from './servicesSection';
import SmeDevelopmentStage from './smeDevelopmentStage';
import SmeGuidelines from './smeGuidelines';

// Example data type
interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  createdAt: string;
}

// Example data
const data: Payment[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  amount: Math.floor(Math.random() * 1000) + 100,
  status: ['pending', 'processing', 'success', 'failed'][
    Math.floor(Math.random() * 4)
  ] as Payment['status'],
  email: `user${i}@example.com`,
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));
export function HomeSection() {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        filterKey: 'status',
      },
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={
              status === 'success'
                ? 'success'
                : status === 'processing'
                  ? 'default'
                  : status === 'pending'
                    ? 'secondary'
                    : 'destructive'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      meta: {
        filterKey: 'email',
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      meta: {
        filterKey: 'amount',
        filterVariant: 'number',
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);

        return <div className="text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        return new Date(row.getValue('createdAt')).toLocaleDateString();
      },
    },
  ];

  return (
    <>
      <PublicHeader />
      <main>
        <section className="relative min-h-screen overflow-y-auto mt-19">
          <div className="flex flex-col items-center justify-center text-center py-10  bg-[#fbfcfd] h-[447px]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Empowering Small & Medium Enterprises <br /> in Koshi Province
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Access business development resources, apply for government
              support schemes, and grow your enterprise.
            </p>
            <div className="flex gap-2">
              <Link
                href="/register"
                className="bg-primary text-white hover:bg-primary/90 px-4 py-1 rounded-md transition-colors"
              >
                Register Now
              </Link>
              <Link
                href="/login"
                className="bg-white text-primary hover:bg-primary/90 px-4 py-1 border border-accent rounded-md transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          {/* SME Development Stage */}
          <SmeDevelopmentStage />
          {/* Services */}
          <ServicesSection />
          <SmeGuidelines />
          <NewsAndEvents />
        </section>
      </main>
      <Footer />
    </>
  );
}
