import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * LinkExcerptDto,
 *
 * @author dafengzhen
 */
export class LinkExcerptDto {
  /**
   * id.
   */
  @IsOptional()
  @IsNumber()
  id?: number;

  /**
   * link.
   */
  @IsOptional()
  @IsString()
  link?: string;

  /**
   * deletionFlag.
   */
  @IsOptional()
  @IsBoolean()
  deletionFlag?: boolean;
}
