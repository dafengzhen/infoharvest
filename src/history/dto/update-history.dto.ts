import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryDto } from './create-history.dto';

/**
 * UpdateHistoryDto
 *
 * @author dafengzhen
 */
export class UpdateHistoryDto extends PartialType(CreateHistoryDto) {}
