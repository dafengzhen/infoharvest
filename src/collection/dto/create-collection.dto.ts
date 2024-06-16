import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

  /**
   * subsetNames.
   */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  subsetNames: string[];

  constructor(values?: Partial<CreateCollectionDto>) {
    Object.assign(this, values);
  }
}
