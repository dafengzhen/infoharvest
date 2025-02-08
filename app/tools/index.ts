import { AUTHORIZATION, BEARER } from '@/app/constants';
import { eventBus } from '@/app/tools/event-bus';
import { EVENT_UNAUTHORIZED } from '@/app/tools/event-types';
import sanitizeHtml from 'sanitize-html';

export const handleApiResponse = async (response: Response, whitelistPath?: string[]) => {
  if (!response.ok) {
    const error = await response.json();
    if (error.statusCode === 401 && typeof localStorage !== undefined && typeof location !== undefined) {
      eventBus.emit(EVENT_UNAUTHORIZED);
    }

    if (
      error.statusCode === 401 &&
      (!Array.isArray(whitelistPath) || (Array.isArray(whitelistPath) && whitelistPath.length === 0)) &&
      typeof location !== undefined
    ) {
      location.assign(getPublicPath() + '/login');
    }

    return Promise.reject(error);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.startsWith('application/json')) {
    return response.json();
  }

  return response;
};

export const isDefinedAndNotEmpty = (...values: (null | number | string | undefined)[]) => {
  return values.every((value) => value !== undefined && value !== null && value !== '');
};

export const buildAuthHeader = (tk: null | string | undefined): Record<string, string> => {
  return tk ? { [AUTHORIZATION]: `${BEARER} ${tk}` } : {};
};

export const buildJsonHeader = (): Record<string, string> => {
  return { 'Content-Type': 'application/json' };
};

export const buildHeaders = (
  ticket: null | string | undefined,
  additionalHeaders: Record<string, string> = {},
): Record<string, string> => {
  return {
    ...buildJsonHeader(),
    ...buildAuthHeader(ticket),
    ...additionalHeaders,
  };
};

export const createUrlResolutionError = (message: string = 'The requested resource URL could not be resolved') => {
  const error = new Error(message);
  error.name = 'UrlResolutionError';
  return error;
};

export const sanitizeInput = (value: string) => {
  return sanitizeHtml(value, {
    allowedAttributes: false,
    allowedSchemesByTag: {
      img: ['data'],
    },
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    nonBooleanAttributes: [],
  });
};

export const getPublicPath = () => {
  return process.env.NEXT_PUBLIC_PUBLIC_PATH || '';
};

const SUPPORTED_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'sms:', 'tel:']);

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank';
    }
  } catch {
    return url;
  }
  return url;
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const isValidIconURL = (url: string): boolean => {
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|ico))$/i;
  const dataUrlPattern = /^data:image\/(png|jpg|jpeg|gif|svg\+xml|ico);base64,[A-Za-z0-9+/=]+$/i;
  return urlPattern.test(url) || dataUrlPattern.test(url);
};

export const isExternalLink = (url: string): boolean => {
  return !url.startsWith(window.location.origin);
};

export const getWallpaperTheme = (wallpaperExists: boolean): { 'data-bs-theme': 'dark' } | {} => {
  return wallpaperExists ? { 'data-bs-theme': 'dark' } : {};
};
