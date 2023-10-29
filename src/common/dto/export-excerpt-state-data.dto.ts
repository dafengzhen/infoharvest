/**
 * ExportExcerptStateDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptStateDataDto {
  constructor(values?: Partial<ExportExcerptStateDataDto>) {
    Object.assign(this, values);
  }

  /**
   * state.
   */
  state: string;
}
