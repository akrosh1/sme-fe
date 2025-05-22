'use client';
import type { ColumnDef } from '@tanstack/react-table';
import Footer from '../common/Footer';
import { DataTable } from '../common/table';
import { Badge } from '../ui/badge';
import FeaturesSection from './featureSection';
import { PublicHeader } from './publicHeader';

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
        <section className="relative min-h-screen pt-32 pb-16 overflow-y-auto bg-background">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Protect Your Privacy, Share What
              <br />
              Matters
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Easily crop out sensitive information on your screen during work
              calls. Keep your focus on what you want to share while maintaining
              full control over your privacy.
            </p>
          </div>
          <FeaturesSection />
          <div className="bg-background/20 backdrop-blur-sm p-4 rounded-xl w-[90%] mx-auto h-[70%] flex  pt-9 md:pt-15">
            <DataTable data={data} columns={columns} totalRows={data.length} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
