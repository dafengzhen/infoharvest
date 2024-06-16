import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse } from '@/app/common/tool';

export interface ICreateExcerptsActionVariables {
  names: string[];
  links?: string[];
  states?: string[];
  icon?: string;
  description?: string;
  sort?: number;
  enableHistoryLogging?: boolean;
  collectionId?: number;
}

export default async function CreateExcerptsAction(
  variables: ICreateExcerptsActionVariables,
) {
  const path = '/excerpts';
  const { response } = await creationResponse<void>(
    fetch(process.env.NEXT_PUBLIC_API_SERVER + path, {
      method: POST,
      body: JSON.stringify(variables),
      headers: {
        ...JSON_HEADER,
        ...AUTHENTICATION_HEADER(await getTicket()),
      },
    }),
  );

  await checkStatusCode(response);
  return response;
}
