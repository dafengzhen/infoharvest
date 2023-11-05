'use server';

import type { IError, IHealth } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';

export default async function HealthAction() {
  const response = await fetch(process.env.API_SERVER + '/health');

  const data = (await response.json()) as IHealth | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as IHealth;
}
