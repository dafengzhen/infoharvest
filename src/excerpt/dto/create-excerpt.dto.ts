import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * CreateExcerptDto,
 *
 * @author dafengzhen
 */
export class CreateExcerptDto {
  /**
   * names.
   */
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  names: string[];

  /**
   * links.
   */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  links: string[];

  /**
   * states.
   */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  states: string[];

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon: string;

  /**
   * description.
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * sort.
   */
  @IsOptional()
  @IsNumber()
  sort: number;

  /**
   * enableHistoryLogging.
   */
  @IsOptional()
  @IsBoolean()
  enableHistoryLogging: boolean;

  /**
   * collectionId.
   */
  @IsOptional()
  @IsNumber()
  collectionId: number;
}
