import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * StateExcerptDto,
 *
 * @author dafengzhen
 */
export class StateExcerptDto {
  /**
   * id.
   */
  @IsOptional()
  @IsNumber()
  id?: number;

  /**
   * state.
   */
  @IsOptional()
  @IsString()
  state?: string;

  /**
   * deletionFlag.
   */
  @IsOptional()
  @IsBoolean()
  deletionFlag?: boolean;
}
