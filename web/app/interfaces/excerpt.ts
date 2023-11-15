import type { ICollection } from '@/app/interfaces/collection';

export interface IExcerpt {
  id: number;
  createDate: string;
  updateDate: string;
  names: IExcerptName[];
  links: IExcerptLink[];
  states: IExcerptState[];
  icon?: string;
  description?: string;
  sort: number;
  enableHistoryLogging: boolean;
  collection?: ICollection;
  _checked?: boolean;
}

export interface IExcerptName {
  id: number;
  createDate: string;
  updateDate: string;
  name: string;
}

export interface IExcerptLink {
  id: number;
  createDate: string;
  updateDate: string;
  link: string;
}

export interface IExcerptState {
  id: number;
  createDate: string;
  updateDate: string;
  state: string;
}
