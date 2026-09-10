import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

import { DynamicRelationLoader } from '../shared/dynamic-relation-loader';
import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { RawTemplateFieldMap } from '../occurrence/template-mapping';
import { ApprovalStatus, DOISourceType } from 'src/commonTypes';
import { DOI } from '../doi/entities/doi.entity';
import { formatDate } from 'src/utils';
import { DoiService } from '../doi/doi.service';
import { ExportJob } from 'src/exports/export-job.entity';

const AZURE_EXPORTS_DIRECTORY =
  process.env.AZURE_EXPORTS_DIRECTORY || 'exports';

type RelationIndexNode = {
  tableName: string;
  relationName: string;
  entityName: string;
  children: Map<string, RelationIndexNode>;
};

@Injectable()
export class DynamicExportServiceV2<T = Occurrence> {
  constructor(
    @InjectRepository(Occurrence)
    private readonly repository: Repository<Occurrence>,
    private readonly doiService: DoiService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Build indexed metadata tree for dynamic relation navigation
   */
  private buildRelationIndex(
    repository: Repository<any>,
    maxDepth = 5,
  ): Map<string, RelationIndexNode> {
    const visited = new Set<string>();

    const build = (
      repo: Repository<any>,
      depth: number,
    ): Map<string, RelationIndexNode> => {
      const map = new Map<string, RelationIndexNode>();
      if (depth > maxDepth) return map;

      const entityName = repo.metadata.name;
      const visitKey = `${entityName}_${depth}`;
      if (visited.has(visitKey)) return map;
      visited.add(visitKey);

      for (const relation of repo.metadata.relations) {
        const targetRepo = repo.manager.getRepository(
          relation.inverseEntityMetadata.target,
        );
        const metadata = relation.inverseEntityMetadata;

        const node: RelationIndexNode = {
          relationName: relation.propertyName,
          entityName: metadata.name,
          tableName: metadata.tableName,
          children: build(targetRepo, depth + 1),
        };
        map.set(relation.propertyName, node);
      }
      return map;
    };

    return build(repository, 1);
  }

  private findValueByTable(
    entity: any,
    tableName: string,
    fieldName: string,
    relationIndex: Map<string, RelationIndexNode>,
    visited = new Set<any>(),
  ): any {
    if (!entity || visited.has(entity)) return undefined;
    visited.add(entity);

    const normalizedTable = tableName?.replace(/"/g, '')?.toLowerCase();

    for (const [relationKey, relationNode] of relationIndex.entries()) {
      const relationValue = entity?.[relationKey];
      if (!relationValue) continue;

      const entityMatch =
        relationNode.entityName?.toLowerCase() === normalizedTable;
      const tableMatch =
        relationNode.tableName?.toLowerCase() === normalizedTable;

      if (entityMatch || tableMatch) {
        if (Array.isArray(relationValue)) {
          return relationValue
            .map((item) => item?.[fieldName])
            .filter((v) => v !== undefined)
            .join(', ');
        }
        return relationValue?.[fieldName];
      }

      if (Array.isArray(relationValue)) {
        for (const item of relationValue) {
          const result = this.findValueByTable(
            item,
            tableName,
            fieldName,
            relationNode.children,
            visited,
          );
          if (result !== undefined) return result;
        }
        continue;
      }

      const result = this.findValueByTable(
        relationValue,
        tableName,
        fieldName,
        relationNode.children,
        visited,
      );
      if (result !== undefined) return result;
    }

    return undefined;
  }

  private mapEntityToRow(
    entity: any,
    columns: any[],
    relationIndex: Map<string, RelationIndexNode>,
    baseTableName = 'occurrence',
  ) {
    const row: Record<string, any> = {};

    for (const col of columns) {
      const tableName = col.table;
      const fieldName = col.table_field;

      if (!tableName || tableName === baseTableName) {
        row[col.template_field] = entity?.[fieldName];
        continue;
      }

      row[col.template_field] = this.findValueByTable(
        entity,
        tableName,
        fieldName,
        relationIndex,
      );
    }
    return row;
  }

  /**
   * Main memory-efficient background exporter. Writes directly to disk stream.
   */
  async exportAllToExcelBackground(
    filters: any,
    columns: RawTemplateFieldMap[],
    targetFilePath: string | null = null,
    pageSize = 200,
    yieldAfter = 5,
    exportJob: ExportJob = null,
    updateProgressCallback?: (jobId: string, progress: number) => void,
    saveToDisk = true,
    excludeColumns: string[] = [],
    occurrenceIds: string[] = [],
    generateDoi = false,
  ): Promise<string> {
    const exportDir = path.join(process.cwd(), AZURE_EXPORTS_DIRECTORY);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    console.log('Using pageSize of', pageSize);

    const finalPath =
      targetFilePath ||
      path.join(exportDir, `va_export_${exportJob?.id || Date.now()}.xlsx`);

    // 1. Initialize Streaming Workbook Writer directly to local file
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: finalPath,
      useSharedStrings: false, // Prevents holding string dictionary in V8 Heap
      useStyles: false, // Disables keeping style objects in memory
    });

    const worksheet = workbook.addWorksheet('Data');

    const sortedColumns = [...columns]
      .filter(
        (a) =>
          !excludeColumns
            .map((e) => e.toLowerCase())
            .includes(a.template_field.toLowerCase()),
      )
      .sort((a, b) => a.sequence - b.sequence);

    const relationIndex = this.buildRelationIndex(this.repository);

    // 2. Add columns and flush header row
    worksheet.columns = sortedColumns.map((col) => ({
      header: col.template_field,
      key: col.template_field,
    }));
    worksheet.getRow(1).commit();

    const loader = new DynamicRelationLoader(this.repository);
    const approvedIds = occurrenceIds || [];

    // If no occurrenceIds provided, fetch all occurrences using filters
    const useAllOccurrences = !approvedIds || approvedIds.length === 0;
    const total = useAllOccurrences ? 1 : Math.max(approvedIds.length, 1);

    let page = 0;
    let entities: any[] = [];

    while (true) {
      const skip = page * pageSize;

      if (useAllOccurrences) {
        // Fetch all occurrences with filters and pagination
        entities = await loader.find({
          where: filters || {},
          order: { id: 'ASC' },
          skip,
          take: pageSize,
        });
        if (!entities.length) break;
      } else {
        // Use the existing ID-based approach
        const ids = approvedIds.slice(skip, skip + pageSize);
        if (!ids.length) break;

        entities = await loader.find({
          where: { id: In(ids) },
          order: { id: 'ASC' },
        });
        if (!entities.length) break;
      }

      // Map each entity to row and commit immediately to disk
      for (const entity of entities) {
        const row = this.mapEntityToRow(entity, sortedColumns, relationIndex);
        worksheet.addRow(row).commit(); // Flush row memory immediately
      }

      page++;
      if (updateProgressCallback && exportJob) {
        const progress = Math.round(
          (Math.min(page * pageSize, total) / total) * 85,
        );
        updateProgressCallback(exportJob.id, progress);
      }

      // yield every x pages
      // Potentially gives other HTTP requests and health checks an immediate turn on the event loop
      if (page % yieldAfter === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }
    }

    // Add Filters and DOI Worksheet
    await this.makeFiltersAndDOISheet(
      workbook,
      filters,
      generateDoi,
      exportJob,
    );

    // Finalize file write
    await worksheet.commit();
    await workbook.commit();

    return finalPath;
  }

  private async makeFiltersAndDOISheet(
    workbook: ExcelJS.stream.xlsx.WorkbookWriter,
    filters: any,
    generateDoi: boolean,
    exportJob: ExportJob,
  ) {
    const sheet2 = workbook.addWorksheet('Filters & DOI');
    sheet2.addRow(['Filters', '']).commit();

    console.log('makeFiltersAndDOISheet filters:', JSON.stringify(filters));
    if (filters) {
      console.log(`Processing ${Object.keys(filters).length} filters`);
      Object.keys(filters).forEach((element) => {
        const val = filters[element];
        // Convert complex values to readable strings
        let displayValue = val;
        if (Array.isArray(val)) {
          displayValue = val.join(', ');
        } else if (typeof val === 'object' && val !== null) {
          // Handle nested timeRange object if it wasn't sanitized
          if (element === 'timeRange' && val.start !== undefined) {
            const startDate = val.start
              ? new Date(val.start).toISOString().split('T')[0]
              : 'N/A';
            const endDate = val.end
              ? new Date(val.end).toISOString().split('T')[0]
              : 'N/A';
            displayValue = `Start: ${startDate}, End: ${endDate}`;
          } else {
            displayValue = JSON.stringify(val);
          }
        } else if (
          typeof val === 'number' &&
          (element === 'startTimestamp' || element === 'endTimestamp')
        ) {
          // Convert Unix timestamp to human-readable date
          displayValue = new Date(val).toISOString().split('T')[0];
        }
        console.log(`Adding filter row: ${element}=${displayValue}`);
        sheet2.addRow([element, displayValue]).commit();
      });

      if (generateDoi) {
        sheet2.addRow([]).commit();
        const downloaderEmail = exportJob ? exportJob.downloaderEmail : null;
        const downloaderName = exportJob ? exportJob.downloaderName : null;
        const doi = await this.saveDOI(
          downloaderEmail,
          downloaderName,
          exportJob,
          filters,
        );
        sheet2.addRow(['DOI:', doi?.doi_link || 'Pending']).commit();
      }
    }
    await sheet2.commit();
  }

  private async saveDOI(
    downloaderEmail: string,
    downloaderName: string,
    exportJob: ExportJob,
    filters: any,
  ) {
    const doi = new DOI();
    doi.creator_email = downloaderEmail;
    doi.creator_name = downloaderName;
    doi.publication_year = new Date().getFullYear();
    doi.title = 'Data Download - ' + formatDate(new Date());
    doi.approval_status = ApprovalStatus.PENDING;

    // Create a human-readable version of filters for description
    const readableFilters: any = {};
    Object.keys(filters).forEach((key) => {
      const val = filters[key];
      if (key === 'startTimestamp' || key === 'endTimestamp') {
        readableFilters[key] = new Date(val).toISOString().split('T')[0];
      } else if (Array.isArray(val)) {
        readableFilters[key] = val.join(', ');
      } else {
        readableFilters[key] = val;
      }
    });

    doi.description =
      'Data downloaded with filters: ' + JSON.stringify(readableFilters);
    doi.source_type = DOISourceType.DOWNLOAD;
    doi.meta_data = { fields: [], filters: readableFilters };
    doi.export_job = exportJob;

    let res = await this.doiService.upsert(doi);
    if (res) {
      res = await this.doiService.approveDOI(doi.id, downloaderEmail);
    }
    return res;
  }
}
