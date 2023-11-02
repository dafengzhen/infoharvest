import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SubsetUpdateCollectionDto,
 *
 * @author dafengzhen
 */
export class SubsetUpdateCollectionDto {
  /**
   * id.
   */
  @IsOptional()
  @IsNumber()
  id?: number;

  /**
   * name.
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * sort.
   */
  @IsOptional()
  @IsNumber()
  sort?: number;
}
