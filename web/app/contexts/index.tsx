import { createContext, MutableRefObject } from 'react';
import { IToastRef } from '@/app/common/toast';

export const GlobalContext = createContext<{
  toast: MutableRefObject<IToastRef>;
}>({
  toast: {
    current: {
      showToast: () => '',
      hideToast: () => {},
    },
  },
});
