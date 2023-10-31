'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import Toast, { IToastRef } from '@/app/common/toast';

export function Providers(props: { children: ReactNode }) {
  const toastRef = useRef<IToastRef>({
    showToast: () => '',
    hideToast: () => {},
  });
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {},
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={{ toast: toastRef }}>
        {props.children}
        <Toast ref={toastRef} />
      </GlobalContext.Provider>
      {<ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
