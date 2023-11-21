import {
  createContext,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react';
import { type IToastRef } from '@/app/common/toast';
import { type IExcerpt } from '@/app/interfaces/excerpt';

export const GlobalContext = createContext<{
  toast: MutableRefObject<IToastRef>;
  tagState?: [string, Dispatch<SetStateAction<string>>];
  copyExcerptState?: [
    IExcerpt | undefined,
    Dispatch<SetStateAction<IExcerpt | undefined>>,
  ];
}>({
  toast: {
    current: {
      showToast: () => '',
      hideToast: () => {},
    },
  },
});
