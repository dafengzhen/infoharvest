/**
 * ExportExcerptLinkDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptLinkDataDto {
  constructor(values?: Partial<ExportExcerptLinkDataDto>) {
    Object.assign(this, values);
  }

  /**
   * link.
   */
  link: string;
}
