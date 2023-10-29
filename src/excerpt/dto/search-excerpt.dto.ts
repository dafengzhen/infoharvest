import { IsNotEmpty, IsString } from 'class-validator';

/**
 * SearchExcerptDto,
 *
 * @author dafengzhen
 */
export class SearchExcerptDto {
  /**
   * name.
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
