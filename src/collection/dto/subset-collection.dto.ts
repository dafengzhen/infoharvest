import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SubsetCollectionDto,
 *
 * @author dafengzhen
 */
export class SubsetCollectionDto {
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

  /**
   * deletionFlag.
   */
  @IsOptional()
  @IsBoolean()
  deletionFlag?: boolean;
}
