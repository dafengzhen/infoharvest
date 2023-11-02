import {
  createContext,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react';
import { type IToastRef } from '@/app/common/toast';

export const GlobalContext = createContext<{
  toast: MutableRefObject<IToastRef>;
  tagState?: [string, Dispatch<SetStateAction<string>>];
}>({
  toast: {
    current: {
      showToast: () => '',
      hideToast: () => {},
    },
  },
});
