import { cookies } from 'next/headers';
import { TK } from '@/app/constants';
import UnauthorizedException from '@/app/exception/unauthorized-exception';

export const checkTicket = () => {
  const cookieStore = cookies();
  const tk = cookieStore.get(TK);

  if (!tk) {
    throw UnauthorizedException();
  }

  return tk.value;
};

export const deleteTicket = () => {
  cookies().delete(TK);
};

export const getQueryParams = (
  init?: string[][] | Record<string, string> | string | URLSearchParams,
) => {
  return new URLSearchParams(init).toString();
};
