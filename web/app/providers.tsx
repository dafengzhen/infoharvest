'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {},
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {<ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
