import type { CustomModalHandle } from '@/app/components/custom-modal';
import type { ReactNode, RefObject } from 'react';

import CustomModal from '@/app/components/custom-modal';
import { createContext, useRef } from 'react';

export type ModalContextType = RefObject<CustomModalHandle | null>;

export const ModalContext = createContext<ModalContextType>({ current: null });

export const ModalProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const modalRef = useRef<CustomModalHandle>(null);

  return (
    <ModalContext.Provider value={modalRef}>
      {children}
      <CustomModal ref={modalRef} />
    </ModalContext.Provider>
  );
};
