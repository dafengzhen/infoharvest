/**
 * ExportExcerptNameDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptNameDataDto {
  constructor(values?: Partial<ExportExcerptNameDataDto>) {
    Object.assign(this, values);
  }

  /**
   * name.
   */
  name: string;
}
