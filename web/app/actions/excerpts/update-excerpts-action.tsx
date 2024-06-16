import { AUTHENTICATION_HEADER, JSON_HEADER, PATCH } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse, destructureId } from '@/app/common/tool';

export interface IUpdateExcerptsActionVariables {
  id: number;
  names: {
    id?: number;
    name: string;
  }[];
  links?: {
    id?: number;
    link?: string;
  }[];
  states?: {
    id?: number;
    state?: string;
  }[];
  icon?: string;
  description?: string;
  sort?: number;
  enableHistoryLogging?: boolean;
  collectionId?: number;
  deleteCollection?: boolean;
}

export default async function UpdateExcerptsAction(
  variables: IUpdateExcerptsActionVariables,
) {
  const { id, _variables } = destructureId(variables);
  const path = `/excerpts/${id}`;
  const excerptsPath = '/excerpts';
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
