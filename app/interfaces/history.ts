import type { IBase } from '@/app/interfaces';
import type { IExcerpt } from '@/app/interfaces/excerpt';

export interface IHistory extends IBase {
  customConfig: {
    [key: string]: unknown;
    type: 'history';
  };
  darkIcon?: string;
  description?: string;
  excerpt: IExcerpt;
  icon?: string;
  links: string[];
  names: string[];
  order: number;
}

export interface IUpdateHistoryCustomConfigDto {
  [key: string]: unknown;
  type: 'history';
}
