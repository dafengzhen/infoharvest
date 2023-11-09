import type { ICollection } from '@/app/interfaces/collection';

export interface IHistory {
  id: number;
  createDate: string;
  updateDate: string;
  hNames: string[];
  hLinks: string[];
  hStates: string[];
  icon?: string;
  description?: string;
  sort: number;
  enableHistoryLogging: boolean;
  collection?: ICollection;
}
