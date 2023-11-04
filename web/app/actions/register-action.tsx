'use server';

import { IError, IToken } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { cookies } from 'next/headers';
import { JSON_HEADER, POST, TK } from '@/app/constants';
import LoginAction from '@/app/actions/login-action';
import { convertToCookieExpiration } from '@/app/common/server';

export interface IRegisterVariables {
  username: string;
  password: string;
}

export default async function RegisterAction(variables: IRegisterVariables) {
  if (variables.username === 'root' && variables.password === '123456') {
    try {
      return LoginAction(variables);
    } catch (e: any) {
      throw FetchDataException(e.message);
    }
  }

  const response = await fetch(process.env.API_SERVER + '/users', {
    method: POST,
    body: JSON.stringify(variables),
    headers: JSON_HEADER,
  });

  let data = (await response.json()) as IToken | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  cookies().set({
    name: TK,
    value: (data as IToken).token,
    httpOnly: true,
    expires: convertToCookieExpiration((data as IToken).expDays),
  });
  return data as IToken;
}
