'use server';

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

export const isNum = (val: string | number) => {
  return !isNaN(parseInt(val + ''));
};

export const excludeId = (source: Record<string, any>) => {
  const { id, ..._variables } = Object.assign({}, source);
  return { id, _variables };
};

export const convertToCookieExpiration = (days: number) => {
  return new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
};

export const processFirstCharacter = (username: string) => {
  let firstChar = username.substring(0, 1);
  if (/^[a-zA-Z]/.test(firstChar)) {
    firstChar = firstChar.toUpperCase();
  }
  return firstChar;
};
