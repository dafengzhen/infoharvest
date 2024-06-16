import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { creationResponse, destructureId } from '@/app/common/tool';
import { checkStatusCode, getTicket } from '@/app/common/server';

export interface IUpdateCollectionsActionVariables {
  id: number;
  name?: string;
  sort?: number;
  subset?: Partial<Omit<IUpdateCollectionsActionVariables, 'subset'>>[];
}

export default async function UpdateCollectionsAction(
  variables: IUpdateCollectionsActionVariables,
) {
  const { id, _variables } = destructureId(variables);
  const path = `/collections/${id}`;
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: PATCH,
      body: JSON.stringify(_variables),
      headers: {
        ...JSON_HEADER,
        ...AUTHENTICATION_HEADER(await getTicket()),
      },
    }),
  );

  await checkStatusCode(response);
  return response;
}
