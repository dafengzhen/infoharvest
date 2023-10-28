import { SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { IPagination } from '../interface/pagination';

/**
 * Paginate.
 *
 * @author dafengzhen
 */
export async function Paginate<T>(
  qb: SelectQueryBuilder<T>,
  paginationQuery?: PaginationQueryDto,
): Promise<IPagination<T>> {
  const { page, size, limit, offset } = paginationQuery ?? {
    page: 1,
    size: 15,
    limit: 15,
    offset: 1,
  };

  const _page = page ?? 1;
  const _size = size ?? 15;
  const _limit = limit ?? _size;
  const _offset = offset ?? (_page - 1) * _limit;
  const data = await qb.skip(_offset).take(_limit).getMany();
  const pages = Math.ceil((await qb.getCount()) / _limit);

  return {
    size: _limit,
    page: _page,
    pages,
    next: _page + 1 < pages,
    previous: _page - 1 > 1,
    data,
  };
}
