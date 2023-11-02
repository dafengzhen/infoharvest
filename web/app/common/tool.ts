import { cookies } from 'next/headers';
import { TK } from '@/app/constants';
import UnauthorizedException from '@/app/exception/unauthorized-exception';
import { redirect } from 'next/navigation';

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

export const checkStatusCode = (statusCode: number) => {
  if (statusCode === 401) {
    redirect('/login');
  }
};
