import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';
import { Type } from 'class-transformer';

/**
 * UpdateCollectionDto,
 *
 * @author dafengzhen
 */
export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  /**
   * sort.
   */
  @IsNumber()
  @IsOptional()
  sort?: number;

  /**
   * subset.
   */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCollectionDto)
  subset?: CreateCollectionDto[];
}
