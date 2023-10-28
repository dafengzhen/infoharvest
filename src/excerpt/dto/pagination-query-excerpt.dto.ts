import { IsNumber, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

/**
 * PaginationQueryExcerptDto.
 *
 * @author dafengzhen
 */
export class PaginationQueryExcerptDto extends PaginationQueryDto {
  /**
   * collectionId.
   */
  @IsOptional()
  @IsNumber()
  collectionId?: number;
}
