import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * NameExcerptDto,
 *
 * @author dafengzhen
 */
export class NameExcerptDto {
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
   * deletionFlag.
   */
  @IsOptional()
  @IsBoolean()
  deletionFlag?: boolean;
}
