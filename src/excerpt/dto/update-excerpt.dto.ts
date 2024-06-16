import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateExcerptDto } from './create-excerpt.dto';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NameExcerptDto } from './name-excerpt.dto';
import { LinkExcerptDto } from './link-excerpt.dto';
import { StateExcerptDto } from './state-excerpt.dto';

export class UpdateExcerptDto extends PartialType(
  OmitType(CreateExcerptDto, ['names', 'links', 'states'] as const),
) {
  /**
   * names.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameExcerptDto)
  names: NameExcerptDto[];

  /**
   * links.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkExcerptDto)
  links: LinkExcerptDto[];

  /**
   * states.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StateExcerptDto)
  states: StateExcerptDto[];

  /**
   * deleteCollection.
   */
  @IsOptional()
  @IsBoolean()
  deleteCollection?: boolean;
}
