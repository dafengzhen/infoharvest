import { PartialType } from '@nestjs/mapped-types';
import { ExportDataDto } from './export-data.dto';

/**
 * ImportDataDto,
 *
 * @author dafengzhen
 */
export class ImportDataDto extends PartialType(ExportDataDto) {}
