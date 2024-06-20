import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkStatusCode, getTicket } from '@/app/common/server';
import { creationResponse } from '@/app/common/tool';
import { ICheckLinkValidity } from '@/app/interfaces/excerpt';

export interface ICheckLinkValidityExcerptsActionVariables {
  links?: string[];
  headers?: Record<string, string>;
}

export default async function CheckLinkValidityExcerptsAction(
  variables: ICheckLinkValidityExcerptsActionVariables,
) {
  const path = '/excerpts/check-link-validity';
  const { response } = await creationResponse<ICheckLinkValidity[]>(
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
