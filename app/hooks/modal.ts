import type { ModalContextType } from '@/app/contexts/modal';

import { ModalContext } from '@/app/contexts/modal';
import { useContext } from 'react';

const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default useModal;
