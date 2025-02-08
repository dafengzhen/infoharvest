import type { IError } from '@/app/interfaces';
import type { IHistory, IUpdateHistoryCustomConfigDto } from '@/app/interfaces/history';

import { PATCH } from '@/app/constants';
import { useResolvedUrl, useStoredTicket } from '@/app/hooks';
import {
  buildAuthHeader,
  buildHeaders,
  createUrlResolutionError,
  handleApiResponse,
  isDefinedAndNotEmpty,
} from '@/app/tools';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useFetchHistories = (enabled?: boolean) => {
  const url = useResolvedUrl('/histories');
  const ticket = useStoredTicket();

  return useQuery<IHistory[], IError>({
    enabled: isDefinedAndNotEmpty(url, ticket) && enabled,
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchHistories.key, url, ticket],
  });
};

useFetchHistories.key = 'fetchHistories';

export const useUpdateHistoryCustomConfig = (historyId?: number) => {
  const url = useResolvedUrl(historyId ? `/histories/${historyId}/custom-config` : null);
  const ticket = useStoredTicket();

  return useMutation<void, IError, IUpdateHistoryCustomConfigDto>({
    mutationFn: async (options: IUpdateHistoryCustomConfigDto) => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        body: JSON.stringify(options),
        headers: buildHeaders(ticket),
        method: PATCH,
      });

      return handleApiResponse(response);
    },
    mutationKey: [useUpdateHistoryCustomConfig.key],
  });
};

useUpdateHistoryCustomConfig.key = 'updateHistoryCustomConfig';
