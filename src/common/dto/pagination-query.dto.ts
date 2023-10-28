import { IsNumber, IsOptional, IsPositive } from 'class-validator';

/**
 * PaginationQueryDto.
 *
 * @author dafengzhen
 */
export class PaginationQueryDto {
  /**
   * limit.
   */
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit?: number;

  /**
   * offset.
   */
  @IsPositive()
  @IsOptional()
  @IsNumber()
  offset?: number;

  /**
   * size.
   */
  @IsOptional()
  @IsPositive()
  @IsNumber()
  size?: number;

  /**
   * page.
   */
  @IsPositive()
  @IsOptional()
  @IsNumber()
  page?: number;
}
