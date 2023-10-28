/**
 * IPagination.
 *
 * @author dafengzhen
 */
export interface IPagination<T> {
  size: number;
  page: number;
  pages: number;
  next: boolean;
  previous: boolean;
  data: T[];
}
