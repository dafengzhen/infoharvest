import { IToken } from "@/app/interfaces";
import { JSON_HEADER, POST, TK } from "@/app/constants";
import { creationResponse } from "@/app/common/tool";

export interface IRegisterActionVariables {
  username: string;
  password: string;
}

export default async function RegisterAction(
  variables: IRegisterActionVariables,
) {
  const { response } = await creationResponse<IToken>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + '/users', {
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
