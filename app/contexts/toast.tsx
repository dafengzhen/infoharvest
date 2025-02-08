import type { ReactNode, RefObject } from 'react';

import CustomToast, { type CustomToastHandle } from '@/app/components/custom-toast';
import { createContext, useRef } from 'react';

export type ToastContextType = RefObject<CustomToastHandle | null>;

export const ToastContext = createContext<ToastContextType>({ current: null });

export const ToastProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const toastRef = useRef<CustomToastHandle>(null);

  return (
    <ToastContext.Provider value={toastRef}>
      {children}
      <CustomToast ref={toastRef} />
    </ToastContext.Provider>
  );
};
