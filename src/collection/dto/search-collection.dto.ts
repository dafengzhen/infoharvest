import { IsNotEmpty, IsString } from 'class-validator';

/**
 * SearchCollectionDto,
 *
 * @author dafengzhen
 */
export class SearchCollectionDto {
  /**
   * name.
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
