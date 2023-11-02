'use server';

import { IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { JSON_HEADER, POST } from '@/app/constants';

export default async function CreateExampleUserAction() {
  const response = await fetch(process.env.API_SERVER + '/users/example', {
    method: POST,
    headers: JSON_HEADER,
  });

  const data = (await response.json()) as any | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data;
}
