import { ToastContext, type ToastContextType } from '@/app/contexts/toast';
import { useContext } from 'react';

const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
