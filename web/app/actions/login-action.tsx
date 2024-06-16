import type { IToken } from '@/app/interfaces';
import { JSON_HEADER, POST, TK } from '@/app/constants';
import { creationResponse } from '@/app/common/tool';

export interface ILoginActionVariables {
  username: string;
  password: string;
}

export default async function LoginAction(variables: ILoginActionVariables) {
  const { response } = await creationResponse<IToken>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + '/auth/login', {
      method: POST,
      body: JSON.stringify(variables),
      headers: JSON_HEADER,
    }),
  );

  if (response.ok) {
    localStorage.setItem(TK, response.data.token);
  }

  return response;
}
