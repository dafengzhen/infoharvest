'use server';

import { IError, IToken } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { cookies } from 'next/headers';
import { JSON_HEADER, POST, TK } from '@/app/constants';
import CreateExampleUserAction from '@/app/actions/create-example-user-action';
import { convertToCookieExpiration } from '@/app/common/server';

export interface ILoginVariables {
  username: string;
  password: string;
}

export default async function LoginAction(variables: ILoginVariables) {
  const response = await fetchLogin(variables);

  let data = (await response.json()) as IToken | IError;
  if (!response.ok) {
    if (
      variables.username === 'root' &&
      variables.password === '123456' &&
      (data as IError).statusCode === 401
    ) {
      await CreateExampleUserAction();
      const tryAgain = await fetchLogin(variables);
      const result = (await tryAgain.json()) as IToken | IError;
      if (!tryAgain.ok) {
        throw FetchDataException((result as IError).message);
      }
      data = result;
      console.log(
        'Failed to log in with the sample user, the sample user has been created',
      );
    } else {
      throw FetchDataException((data as IError).message);
    }
  }

  cookies().set({
    name: TK,
    value: (data as IToken).token,
    httpOnly: true,
    expires: convertToCookieExpiration((data as IToken).expDays),
  });
  return data as IToken;
}

function fetchLogin(variables: ILoginVariables) {
  return fetch(process.env.API_SERVER + '/auth/login', {
    method: POST,
    body: JSON.stringify(variables),
    headers: JSON_HEADER,
  });
}
