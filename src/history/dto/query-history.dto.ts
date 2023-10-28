import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * QueryHistoryDto
 *
 * @author dafengzhen
 */
export class QueryHistoryDto {
  /**
   * excerptId.
   */
  @IsNotEmpty()
  @IsNumber()
  excerptId: number;
}
