import type { IError } from '@/app/interfaces';
import type { ICollection, ISaveCollectionDto, IUpdateCollectionCustomConfigDto } from '@/app/interfaces/collection';
import type { IExcerpt } from '@/app/interfaces/excerpt';

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

export const useFetchCollections = () => {
  const url = useResolvedUrl('/collections');
  const ticket = useStoredTicket();

  return useQuery<ICollection[], IError>({
    enabled: isDefinedAndNotEmpty(url, ticket),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchCollections.key, url, ticket],
  });
};

useFetchCollections.key = 'fetchCollections';

export const useFetchCollectionById = (collectionId?: number) => {
  const url = useResolvedUrl(collectionId ? `/collections/${collectionId}` : null);
  const ticket = useStoredTicket();

  return useQuery<ICollection, IError>({
    enabled: isDefinedAndNotEmpty(url, ticket, collectionId),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchCollectionById.key, url, ticket, collectionId],
  });
};

useFetchCollectionById.key = 'fetchCollectionById';

export const useFetchExcerptsByCollectionId = (collectionId?: number) => {
  const url = useResolvedUrl(collectionId ? `/collections/${collectionId}/excerpts` : null);
  const ticket = useStoredTicket();

  return useQuery<IExcerpt[], IError>({
    enabled: isDefinedAndNotEmpty(url, ticket, collectionId),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      const collection = (await handleApiResponse(response)) as ICollection;
      return collection.excerpts || [];
    },
    queryKey: [useFetchExcerptsByCollectionId.key, url, ticket, collectionId],
  });
};

useFetchExcerptsByCollectionId.key = 'fetchExcerptsByCollectionId';

export const useFetchCollectionBySearch = (name?: string) => {
  const url = useResolvedUrl(name ? `/collections/search?name=${name}` : null);
  const ticket = useStoredTicket();

  return useQuery<ICollection[], IError>({
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
    queryKey: [useFetchCollectionById.key, url, ticket, name],
  });
};

useFetchCollectionBySearch.key = 'fetchCollectionBySearch';

export const useSaveCollection = () => {
  const url = useResolvedUrl('/collections');
  const ticket = useStoredTicket();

  return useMutation<void, IError, ISaveCollectionDto>({
    mutationFn: async (options: ISaveCollectionDto) => {
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
    mutationKey: [useSaveCollection.key],
  });
};

useSaveCollection.key = 'saveCollection';

export const useUpdateCollectionCustomConfig = (collectionId?: number) => {
  const url = useResolvedUrl(collectionId ? `/collections/${collectionId}/custom-config` : null);
  const ticket = useStoredTicket();

  return useMutation<void, IError, IUpdateCollectionCustomConfigDto>({
    mutationFn: async (options: IUpdateCollectionCustomConfigDto) => {
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
    mutationKey: [useUpdateCollectionCustomConfig.key],
  });
};

useUpdateCollectionCustomConfig.key = 'updateCollectionCustomConfig';

export const useDeleteCollection = (collectionId?: number) => {
  const url = useResolvedUrl(collectionId ? `/collections/${collectionId}` : null);
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
    mutationKey: [useDeleteCollection.key],
  });
};

useDeleteCollection.key = 'deleteCollection';
