'use client';

import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // retry: 1,
    },
  },
});

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          duration={3000}
          position="top-right"
          className="z-9999 bg-white"
        />
      </QueryClientProvider>
    </Provider>
  );
}
