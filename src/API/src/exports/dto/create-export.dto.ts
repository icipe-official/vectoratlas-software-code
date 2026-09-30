export class CreateExportDto {
  filtersJson: string;
  generateDoi?: boolean;
  downloaderName?: string;
  downloaderEmail?: string;
  clientRequestId?: string;
  contentHash?: string;
}
