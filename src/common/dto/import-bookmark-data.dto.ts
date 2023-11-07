import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ImportBookmarkDataDto,
 *
 * @author dafengzhen
 */
export class ImportBookmarkDataDto {
  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * addDate.
   */
  @IsOptional()
  @IsString()
  addDate: string;

  /**
   * lastModified.
   */
  @IsOptional()
  @IsString()
  lastModified: string;

  /**
   * personalToolbarFolder.
   */
  @IsOptional()
  @IsString()
  personalToolbarFolder: string;

  /**
   * children.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ImportBookmarkDataDto)
  children: ImportBookmarkDataDto[];

  /**
   * bookmarks.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => IBookmarkDto)
  bookmarks: IBookmarkDto[];
}

/**
 * IBookmarkDto,
 *
 * @author dafengzhen
 */
export class IBookmarkDto {
  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * href.
   */
  @IsNotEmpty()
  @IsString()
  href: string;

  /**
   * addDate.
   */
  @IsOptional()
  @IsString()
  addDate: string;

  /**
   * lastModified.
   */
  @IsOptional()
  @IsString()
  lastModified: string;

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon: string;
}
