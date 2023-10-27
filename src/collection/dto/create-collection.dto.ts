import { IsNotEmpty, IsString } from 'class-validator';

/**
 * CreateCollectionDto,
 *
 * @author dafengzhen
 */
export class CreateCollectionDto {
  /**
   * name.
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
