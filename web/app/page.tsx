import Home from '@/app/home';
import { type Metadata } from 'next';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { type TUsersCountByDate } from '@/app/interfaces/user';
import { type IError } from '@/app/interfaces';
import format from 'date-fns/format';

export const metadata: Metadata = {
  title: 'home - infoharvest',
  description:
    'infoharvest is a bookmarking tool that enables users to collect and store interesting online content for easy access and management',
};

async function fetchData() {
  const response = await fetch(process.env.API_SERVER + '/users/countByDate', {
    next: {
      tags: ['usersCountByDate'],
    },
  });

  const data = (await response.json()) as TUsersCountByDate | IError;
  if (!response.ok) {
    throw FetchDataException((data as IError).message);
  }

  return (data as TUsersCountByDate).map((item) => {
    item.date = format(new Date(item.date), 'yyyy-MM-dd');
    return item;
  }) as TUsersCountByDate;
}

export default async function Page() {
  return <Home countByDate={await fetchData()} />;
}
