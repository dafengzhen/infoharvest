import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse } from '@/app/common/tool';

export interface IDeleteExcerptsActionVariables {
  id: number;
}

export default async function DeleteExcerptsAction(
  variables: IDeleteExcerptsActionVariables,
) {
  const path = `/excerpts/${variables.id}`;
  const excerptsPath = '/excerpts';
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: DELETE,
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
