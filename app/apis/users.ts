import type { IError, IToken } from '@/app/interfaces';
import type { ILoginDto, IUpdateUserCustomConfigDto, IUser } from '@/app/interfaces/user';

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

export const useLogin = () => {
  const url = useResolvedUrl('/users/login');
  const ticket = useStoredTicket();

  return useMutation<IToken, IError, ILoginDto>({
    mutationFn: async (options: ILoginDto) => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        body: JSON.stringify(options),
        headers: buildHeaders(ticket),
        method: POST,
      });

      return handleApiResponse(response, ['/login']);
    },
    mutationKey: [useLogin.key],
  });
};

useLogin.key = 'login';

export const useFetchUserProfile = () => {
  const url = useResolvedUrl('/users/profile');
  const ticket = useStoredTicket();

  return useQuery<IUser, IError>({
    enabled: isDefinedAndNotEmpty(url),
    queryFn: async () => {
      if (!url) {
        throw createUrlResolutionError();
      }

      const response = await fetch(url, {
        headers: buildAuthHeader(ticket),
      });

      return handleApiResponse(response);
    },
    queryKey: [useFetchUserProfile.key, url, ticket],
  });
};

useFetchUserProfile.key = 'fetchUserProfile';

export const useUpdateUserCustomConfig = (userId?: number) => {
  const url = useResolvedUrl(userId ? `/users/${userId}/custom-config` : null);
  const ticket = useStoredTicket();

  return useMutation<void, IError, IUpdateUserCustomConfigDto>({
    mutationFn: async (options: IUpdateUserCustomConfigDto) => {
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
    mutationKey: [useUpdateUserCustomConfig.key],
  });
};

useUpdateUserCustomConfig.key = 'updateUserCustomConfig';

export const useDeleteUser = (userId?: number) => {
  const url = useResolvedUrl(userId ? `/users/${userId}` : null);
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
    mutationKey: [useDeleteUser.key],
  });
};

useDeleteUser.key = 'deleteUser';
