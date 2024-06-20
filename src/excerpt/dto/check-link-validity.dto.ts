import { IsArray, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * CheckLinkValidityDto,
 *
 * @author dafengzhen
 */
export class CheckLinkValidityDto {
  /**
   * links.
   */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  links: string[];

  /**
   * headers.
   */
  @IsOptional()
  @IsObject()
  headers: Record<string, string>;
}
