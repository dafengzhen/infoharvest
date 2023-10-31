import Collections from '@/app/collections/collections';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import UnauthorizedException from '@/app/exception/unauthorized-exception';
import { ICollection } from '@/app/interfaces/collection';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER } from '@/app/constants';

export const metadata: Metadata = {
  title: 'collections - infoharvest',
  description:
    'this is a collection, and by collection, we mean a grouping of articles for classification',
};

async function fetchData() {
  const cookieStore = cookies();
  const tk = cookieStore.get('tk');

  if (!tk) {
    throw UnauthorizedException();
  }

  const response = await fetch(process.env.API_SERVER + '/collections', {
    headers: AUTHENTICATION_HEADER(tk.value),
    next: {
      tags: ['collections'],
    },
  });

  if (!response.ok) {
    throw FetchDataException();
  }

  return (await response.json()) as Promise<ICollection[]>;
}

export default async function Page() {
  await fetchData();
  return <Collections />;
}
