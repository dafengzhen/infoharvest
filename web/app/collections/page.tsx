import Collections from '@/app/collections/collections';
import { Metadata } from 'next';
import { ICollection } from '@/app/interfaces/collection';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkTicket } from '@/app/common/tool';
import { IError } from '@/app/interfaces';

export const metadata: Metadata = {
  title: 'collections - infoharvest',
  description:
    'this is a collection, and by collection, we mean a grouping of articles for classification',
};

async function fetchData() {
  const response = await fetch(process.env.API_SERVER + '/collections', {
    headers: AUTHENTICATION_HEADER(checkTicket()),
    next: {
      tags: ['collections'],
    },
  });

  const data = (await response.json()) as ICollection[] | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return data as ICollection[];
}

export default async function Page() {
  const data = await fetchData();
  console.log(data);
  return <Collections />;
}
