'use server';

import type { IInvalidLink } from '@/app/bookmarks/parsing-completed';

export default async function CheckLinkValidityAction(variables: string[]) {
  const invalidLinks: Pick<IInvalidLink, 'href' | 'status'>[] = [];
  await Promise.all(
    variables.map((href) =>
      fetch(href, {
        headers: {
          'User-Agent': 'infoharvest/1.0.0',
        },
      }),
    ),
  ).then((responses) => {
    responses.forEach((response, index) => {
      const href = variables[index];
      if (!response.ok) {
        invalidLinks.push({
          href,
          status: response.status,
        });
      }
    });
  });
  return invalidLinks as Pick<IInvalidLink, 'href' | 'status'>[];
}
