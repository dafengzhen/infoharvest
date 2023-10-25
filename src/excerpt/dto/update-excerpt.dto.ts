import { PartialType } from '@nestjs/mapped-types';
import { CreateExcerptDto } from './create-excerpt.dto';

export class UpdateExcerptDto extends PartialType(CreateExcerptDto) {}
