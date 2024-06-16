import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { IExcerpt } from '@/app/interfaces/excerpt';
import { creationResponse, getQueryParams } from '@/app/common/tool';

export interface ISearchExcerptsActionVariables {
  name: string;
}

export default async function SearchExcerptsAction(
  variables: ISearchExcerptsActionVariables,
) {
  const path =
    '/excerpts/search' +
    '?' +
    getQueryParams({ name: encodeURIComponent(variables.name) });
  const { response } = await creationResponse<IExcerpt[]>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      headers: AUTHENTICATION_HEADER(await getTicket()),
    }),
  );

  await checkStatusCode(response);
  return response;
}
