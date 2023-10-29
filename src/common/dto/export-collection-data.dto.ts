import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ExportCollectionDataDto,
 *
 * @author dafengzhen
 */
export class ExportCollectionDataDto {
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
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * sort.
   */
  @IsNotEmpty()
  @IsNumber()
  sort: number;

  /**
   * subset.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportCollectionDataDto)
  subset: ExportCollectionDataDto[];
}
