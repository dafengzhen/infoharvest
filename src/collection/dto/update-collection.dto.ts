import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';
import { Type } from 'class-transformer';
import { SubsetCollectionDto } from './subset-collection.dto';

/**
 * UpdateCollectionDto,
 *
 * @author dafengzhen
 */
export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  /**
   * sort.
   */
  @IsOptional()
  @IsNumber()
  sort?: number;

  /**
   * subset.
   */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubsetCollectionDto)
  subset?: SubsetCollectionDto[];
}
