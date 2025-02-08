import type { IBase } from '@/app/interfaces';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { IUser } from '@/app/interfaces/user';

export interface ICollection extends IBase {
  children: ICollection[];
  customConfig: {
    [key: string]: unknown;
    type: 'collection';
  };
  excerpts: IExcerpt[];
  name: string;
  order: number;
  parent?: ICollection;
  user: IUser;
}

export interface ISaveCollectionDto {
  children?: Omit<ISaveCollectionDto, 'children'>[];
  id?: number;
  name: string;
  order?: number;
}

export interface IUpdateCollectionCustomConfigDto {
  [key: string]: unknown;
  type: 'collection';
}
