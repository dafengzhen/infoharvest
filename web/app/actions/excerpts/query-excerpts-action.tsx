import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { IExcerpt } from '@/app/interfaces/excerpt';
import { creationResponse } from '@/app/common/tool';

export interface IQueryExcerptsActionVariables {
  id: number | string;
}

export default async function QueryExcerptsAction(
  variables: IQueryExcerptsActionVariables,
) {
  const path = `/excerpts/${variables.id}`;
  const { response } = await creationResponse<IExcerpt>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
