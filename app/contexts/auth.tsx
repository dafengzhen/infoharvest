import type { Dispatch, SetStateAction } from 'react';

import { TK } from '@/app/constants';
import { eventBus } from '@/app/tools/event-bus';
import { EVENT_UNAUTHORIZED } from '@/app/tools/event-types';
import { createContext, type ReactNode, useEffect, useState } from 'react';

export interface IAuthContext {
  setToken: Dispatch<SetStateAction<null | string | undefined>>;
  token: null | string | undefined;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [token, setToken] = useState<null | string | undefined>(null);

  useEffect(() => {
    const value = localStorage.getItem(TK);
    if (value && !['false', 'null', 'true', 'undefined'].includes(value)) {
      setToken(value);
    } else {
      localStorage.removeItem(TK);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      localStorage.removeItem(TK);
    };

    eventBus.on(EVENT_UNAUTHORIZED, handleUnauthorized);
    return () => eventBus.off(EVENT_UNAUTHORIZED, handleUnauthorized);
  }, []);

  return <AuthContext.Provider value={{ setToken, token }}>{children}</AuthContext.Provider>;
};
