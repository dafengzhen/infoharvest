import type { IError } from '@/app/interfaces';
import type {
  IExcerpt,
  ISaveExcerptDto,
  IUpdateExcerptCustomConfigDto,
  IValidateLink,
  IValidateLinkDto,
} from '@/app/interfaces/excerpt';
import type { IHistory } from '@/app/interfaces/history';

import { DELETE, PATCH, POST } from '@/app/constants';
import { useResolvedUrl, useStoredTicket } from '@/app/hooks';
import {
  buildAuthHeader,
  buildHeaders,
  createUrlResolutionError,
  handleApiResponse,
  isDefinedAndNotEmpty,
} from '@/app/tools';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useFetchExcerpts = (enabled?: boolean) => {
  const url = useResolvedUrl('/excerpts');
  const ticket = useStoredTicket();

  return useQuery<IExcerpt[], IError>({
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
    queryKey: [useFetchExcerpts.key, url, ticket],
  });
};

useFetchExcerpts.key = 'fetchExcerpts';

export const useFetchExcerptById = (excerptId?: number) => {
  const url = useResolvedUrl(excerptId ? `/excerpts/${excerptId}` : null);
  const ticket = useStoredTicket();

  return useQuery<IExcerpt, IError>({
    enabled: isDefinedAndNotEmpty(url, ticket, excerptId),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchExcerptById.key, url, ticket, excerptId],
  });
};

useFetchExcerptById.key = 'fetchExcerptById';

export const useFetchHistoriesByExcerptId = (excerptId?: number) => {
  const url = useResolvedUrl(excerptId ? `/excerpts/${excerptId}/histories` : null);
  const ticket = useStoredTicket();

  return useQuery<IHistory[], IError>({
    enabled: isDefinedAndNotEmpty(url, ticket, excerptId),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      const excerpt = (await handleApiResponse(response)) as IExcerpt;
      return excerpt.histories || [];
    },
    queryKey: [useFetchHistoriesByExcerptId.key, url, ticket, excerptId],
  });
};

useFetchHistoriesByExcerptId.key = 'fetchHistoriesByTabId';

export const useFetchExcerptBySearch = (name?: string) => {
  const url = useResolvedUrl(name ? `/excerpts/search?name=${name}` : null);
  const ticket = useStoredTicket();

  return useQuery<IExcerpt[], IError>({
    enabled: isDefinedAndNotEmpty(url, ticket, name),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchExcerptById.key, url, ticket, name],
  });
};

useFetchExcerptBySearch.key = 'fetchExcerptBySearch';

export const useSaveExcerpt = () => {
  const url = useResolvedUrl('/excerpts');
  const ticket = useStoredTicket();

  return useMutation<void, IError, ISaveExcerptDto>({
    mutationFn: async (options: ISaveExcerptDto) => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        body: JSON.stringify(options),
        headers: buildHeaders(ticket),
        method: POST,
      });

      return handleApiResponse(response);
    },
    mutationKey: [useSaveExcerpt.key],
  });
};

useSaveExcerpt.key = 'saveExcerpt';

export const useUpdateExcerptCustomConfig = (excerptId?: number) => {
  const url = useResolvedUrl(excerptId ? `/excerpts/${excerptId}/custom-config` : null);
  const ticket = useStoredTicket();

  return useMutation<void, IError, IUpdateExcerptCustomConfigDto>({
    mutationFn: async (options: IUpdateExcerptCustomConfigDto) => {
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
    mutationKey: [useUpdateExcerptCustomConfig.key],
  });
};

useUpdateExcerptCustomConfig.key = 'updateExcerptCustomConfig';

export const useDeleteExcerpt = (excerptId?: number) => {
  const url = useResolvedUrl(excerptId ? `/excerpts/${excerptId}` : null);
  const ticket = useStoredTicket();

  return useMutation<void, IError, void>({
    mutationFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
        method: DELETE,
      });

      return handleApiResponse(response);
    },
    mutationKey: [useDeleteExcerpt.key],
  });
};

useDeleteExcerpt.key = 'deleteExcerpt';

export const useValidateLink = () => {
  const url = useResolvedUrl('/excerpts/validate-link');
  const ticket = useStoredTicket();

  return useMutation<IValidateLink, IError, IValidateLinkDto>({
    mutationFn: async (options: IValidateLinkDto) => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        body: JSON.stringify(options),
        headers: buildHeaders(ticket),
        method: POST,
      });

      return handleApiResponse(response);
    },
    mutationKey: [useValidateLink.key],
  });
};

useValidateLink.key = 'validateLink';
