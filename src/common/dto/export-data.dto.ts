import { ExportUserDataDto } from './export-user-data.dto';
import { ExportCollectionDataDto } from './export-collection-data.dto';
import { ExportExcerptDataDto } from './export-excerpt-data.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ExportDataDto,
 *
 * @author dafengzhen
 */
export class ExportDataDto {
  /**
   * _type.
   */
  @IsNotEmpty()
  @IsString()
  _type: string;

  /**
   * _export_date.
   */
  @IsNotEmpty()
  @IsString()
  _export_date: string;

  /**
   * _export_version.
   */
  @IsNotEmpty()
  @IsString()
  _export_version: string;

  /**
   * user.
   */
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ExportUserDataDto)
  user: ExportUserDataDto;

  /**
   * collections.
   */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExportCollectionDataDto)
  collections: ExportCollectionDataDto[];

  /**
   * collections.
   */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExportExcerptDataDto)
  excerpts: ExportExcerptDataDto[];
}
