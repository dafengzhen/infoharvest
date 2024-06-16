import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { ICollection } from '@/app/interfaces/collection';
import { creationResponse } from '@/app/common/tool';

export interface IQueryCollectionsActionVariables {
  id: string | number;
}

export default async function QueryCollectionsAction(
  variables: IQueryCollectionsActionVariables,
) {
  const path = `/collections/${variables.id}`;
  const { response } = await creationResponse<ICollection>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
