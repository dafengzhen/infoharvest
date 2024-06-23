import { IsOptional, IsString } from 'class-validator';

/**
 * UpdateCustomizationSettingsUserDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsUserDto {
  /**
   * wallpaper.
   */
  @IsOptional()
  @IsString()
  wallpaper?: string;
}
