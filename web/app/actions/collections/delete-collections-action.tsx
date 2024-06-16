import { AUTHENTICATION_HEADER, DELETE } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse } from '@/app/common/tool';

export interface IDeleteCollectionsActionVariables {
  id: number;
}

export default async function DeleteCollectionsAction(
  variables: IDeleteCollectionsActionVariables,
) {
  const path = `/collections/${variables.id}`;
  const collectionsPath = '/collections';
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: DELETE,
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
