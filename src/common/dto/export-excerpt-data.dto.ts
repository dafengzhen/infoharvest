import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ExportExcerptDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptDataDto {
  /**
   /**
   * id.
   */
  @IsNotEmpty()
  @IsNumber()
  id: number;

  /**
   * createDate.
   */
  @IsNotEmpty()
  @IsString()
  createDate: string;

  /**
   * updateDate.
   */
  @IsNotEmpty()
  @IsString()
  updateDate: string;

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
  @IsArray()
  @Type(() => String)
  links: string[];

  /**
   * states.
   */
  @IsArray()
  @Type(() => String)
  states: string[];

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   * description.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * sort.
   */
  @IsNotEmpty()
  @IsNumber()
  sort: number;

  /**
   * enableHistoryLogging.
   */
  @IsNotEmpty()
  @IsBoolean()
  enableHistoryLogging: boolean;

  /**
   * collectionId.
   */
  @IsOptional()
  @IsNumber()
  collectionId?: number;
}
