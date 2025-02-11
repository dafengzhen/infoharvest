import type { IBase } from '@/app/interfaces';
import type { ICollection } from '@/app/interfaces/collection';
import type { IHistory } from '@/app/interfaces/history';
import type { IUser } from '@/app/interfaces/user';

export interface IExcerpt extends IBase {
  _displayMode?: 'bordered' | 'borderless';
  _imageError?: boolean;
  collection: ICollection;
  customConfig: {
    [key: string]: unknown;
    type: 'excerpt';
  };
  darkIcon?: string;
  description?: string;
  histories: IHistory[];
  icon?: string;
  links: IExcerptLink[];
  names: IExcerptName[];
  order: number;
  user: IUser;
}

export interface IExcerptLink extends IBase {
  excerpt: IExcerpt;
  link: string;
}

export interface IExcerptName extends IBase {
  excerpt: IExcerpt;
  name: string;
}

export interface ISaveExcerptDto {
  collectionId?: number;
  darkIcon?: string;
  description?: string;
  icon?: string;
  id?: number;
  links?: ISaveExcerptLinkDto[];
  names: ISaveExcerptNameDto[];
  order?: number;
}

export interface ISaveExcerptLinkDto {
  id?: number;
  link: string;
}

export interface ISaveExcerptNameDto {
  id?: number;
  name: string;
}

export interface IUpdateExcerptCustomConfigDto {
  [key: string]: unknown;
  type: 'excerpt';
}

export interface IValidateLink {
  contentType?: string;
  data?: unknown;
  description?: string;
  link: string;
  message?: string;
  ok: boolean;
  status?: number;
  statusText?: string;
  title?: string;
}

export interface IValidateLinkDto {
  headers: Record<string, string>;
  links: string[];
}
