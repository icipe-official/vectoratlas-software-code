import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { RawTemplateFieldMap } from '../occurrence/template-mapping';
import { ApprovalStatus, DOISourceType } from 'src/commonTypes';
import { DOI } from '../doi/entities/doi.entity';
import { formatDate } from 'src/utils';
import { DoiService } from '../doi/doi.service';
import { ExportJob } from 'src/exports/export-job.entity';

/** Materialized view of finished export rows (Approved datasets only). */
const EXPORT_VIEW = 'va_export_mv';

/** Read at call time, so .env is loaded first. */
const exportFromViewEnabled = () => process.env.EXPORT_FROM_MV === 'true';

const AZURE_EXPORTS_DIRECTORY =
  process.env.AZURE_EXPORTS_DIRECTORY || 'exports';

/**
 * Non-circular relation tree (no back-references), so each table joins once.
 * See docs/export-relation-tree.md.
 */
const EXPORT_RELATIONS = {
  reference: true,
  site: true,
  recordedSpecies: true,
  sample: true,
  dataset: true,
  bionomics: {
    biology: true,
    infection: true,
    bitingRate: true,
    anthropoZoophagic: true,
    endoExophagic: true,
    bitingActivity: true,
    endoExophily: true,
    environment: true,
    LarvalSite: true,
  },
  insecticideResistanceBioassays: {
    genotypicRepresentativeness: true,
    vgscMethodAndSample: true,
    vgscGeneytpeFrequencies: true,
    kdrGenotypeFrequencies: true,
    vgsc995AlleleFrequencies: true,
    vgsc402GenotypeFrequencies: true,
    vgsc402AlleleFrequencies: true,
    vgsc1570GenotypeFrequencies: true,
    vgsc1570AlleleFrequencies: true,
    rdlMethodAndSample: true,
    rdl296GenotypeFrequencies: true,
    rdl296AlleleFrequencies: true,
    ace1MethodAndSample: true,
    ace1GenotypeFrequencies: true,
    ace1AlleleFrequencies: true,
    gsteMethodAndSample: true,
    gste2_119AlleleFrequencies: true,
    gste2_119GenotypeFrequencies: true,
    gste2_114AlleleFrequencies: true,
    gste2_114GenotypeFrequencies: true,
    cyp4j5AlleleFrequencies: true,
    cyp4j5GenotypeFrequencies: true,
    cyp6p4AlleleFrequencies: true,
    cyp6p4GenotypeFrequencies: true,
    cyp6aapAlleleFrequencies: true,
    cyp6aapGenotypeFrequencies: true,
    cytochromesP450_cypMethodAndSample: true,
    vgsc995GenotypeFrequenciesFormally1014: true,
    rdl296cRdl296gRdl296sGenotypeFrequencies: true,
    ace1GenotypeFrequenciesFormally119: true,
  },
};

type RelationIndexNode = {
  tableName: string;
  relationName: string;
  entityName: string;
  children: Map<string, RelationIndexNode>;
};

@Injectable()
export class DynamicExportServiceV2<T = Occurrence> {
  private readonly logger = new Logger(DynamicExportServiceV2.name);
  constructor(
    @InjectRepository(Occurrence)
    private readonly repository: Repository<Occurrence>,
    private readonly doiService: DoiService,
    private readonly dataSource: DataSource,
  ) {}

  // ---------------------------------------------------------------------------
  // Materialized view (va_export_mv)
  // ---------------------------------------------------------------------------

  /** CONCURRENTLY lets downloads keep reading during the refresh. */
  async refreshExportView(): Promise<void> {
    const started = Date.now();
    await this.dataSource.query(
      `REFRESH MATERIALIZED VIEW CONCURRENTLY ${EXPORT_VIEW}`,
    );
    this.logger.log(`${EXPORT_VIEW} refreshed in ${Date.now() - started} ms`);
  }

  /** Counts all view rows, or only the given IDs. */
  private async countViewRows(ids: string[]): Promise<number> {
    const [{ n }] = ids.length
      ? await this.dataSource.query(
          `SELECT count(*)::int AS n FROM ${EXPORT_VIEW} WHERE occurrence_id = ANY($1)`,
          [ids],
        )
      : await this.dataSource.query(
          `SELECT count(*)::int AS n FROM ${EXPORT_VIEW}`,
        );
    return n;
  }

  /**
   * Uses the view only when the output matches the join export.
   * Filters need the join, since the view has no filter columns.
   * ID lists need every ID in the view.
   */
  private async canUseView(filters: any, ids: string[]): Promise<boolean> {
    if (!exportFromViewEnabled()) {
      this.logger.log("EXPORT_FROM_MV is not 'true'; using the join export");
      return false;
    }
    if (!ids.length && filters && Object.keys(filters).length > 0) {
      this.logger.log(
        'Export has filters and no occurrence IDs; using the join export',
      );
      return false;
    }
    if (ids.length && (await this.countViewRows(ids)) !== ids.length) {
      this.logger.warn(
        `Some requested occurrences are not in ${EXPORT_VIEW}; using the join export`,
      );
      return false;
    }
    this.logger.log(`Using ${EXPORT_VIEW} for this export`);
    return true;
  }

  /** Returns [] when the IDs cover the whole view, so pages skip the ID filter. */
  private async idsOrAll(ids: string[]): Promise<string[]> {
    if (!ids.length) return ids;
    const unique = new Set(ids).size;
    return unique === (await this.countViewRows([])) ? [] : ids;
  }

  /** Copies view rows to the worksheet in pages of 2000, keyed by occurrence_id. */
  private async writeRowsFromView(
    worksheet: ExcelJS.Worksheet,
    sortedColumns: RawTemplateFieldMap[],
    ids: string[],
    yieldAfter: number,
    exportJob: ExportJob,
    updateProgressCallback?: (jobId: string, progress: number) => void,
  ): Promise<void> {
    const pageSize = 2000;
    const total = Math.max(await this.countViewRows(ids), 1);
    let lastId: string | null = null;
    let written = 0;
    let page = 0;

    while (true) {
      const where: string[] = [];
      const params: any[] = [];
      if (ids.length) {
        params.push(ids);
        where.push(`occurrence_id = ANY($${params.length})`);
      }
      if (lastId !== null) {
        params.push(lastId);
        where.push(`occurrence_id > $${params.length}`);
      }
      params.push(pageSize);

      const rows: Record<string, any>[] = await this.dataSource.query(
        `SELECT * FROM ${EXPORT_VIEW}
         ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
         ORDER BY occurrence_id
         LIMIT $${params.length}`,
        params,
      );
      if (!rows.length) break;

      // View columns already use template_field names
      for (const r of rows) {
        const row: Record<string, any> = {};
        for (const col of sortedColumns) {
          row[col.template_field] = r[col.template_field];
        }
        worksheet.addRow(row).commit();
      }

      written += rows.length;
      page++;
      if (updateProgressCallback && exportJob) {
        updateProgressCallback(
          exportJob.id,
          Math.round((Math.min(written, total) / total) * 85),
        );
      }
      if (page % yieldAfter === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }

      if (rows.length < pageSize) break;
      lastId = rows[rows.length - 1].occurrence_id;
    }

    this.logger.log(`Exported ${written} rows from ${EXPORT_VIEW}`);
  }

  /** Builds a metadata tree of relations for dynamic lookups. */
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

  /** Streams the export to disk. Uses the view when possible. */
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

    this.logger.log(`Using pageSize of ${pageSize}`);

    const finalPath =
      targetFilePath ||
      path.join(exportDir, `va_export_${exportJob?.id || Date.now()}.xlsx`);

    // Shared strings and styles stay off to keep memory low
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: finalPath,
      useSharedStrings: false,
      useStyles: false,
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

    worksheet.columns = sortedColumns.map((col) => ({
      header: col.template_field,
      key: col.template_field,
    }));
    worksheet.getRow(1).commit();

    const approvedIds = occurrenceIds || [];

    if (await this.canUseView(filters, approvedIds)) {
      await this.writeRowsFromView(
        worksheet,
        sortedColumns,
        await this.idsOrAll(approvedIds),
        yieldAfter,
        exportJob,
        updateProgressCallback,
      );
      await this.makeFiltersAndDOISheet(
        workbook,
        filters,
        generateDoi,
        exportJob,
      );
      await worksheet.commit();
      await workbook.commit();
      return finalPath;
    }

    // With no IDs, only Approved datasets are exported
    const useAllOccurrences = !approvedIds || approvedIds.length === 0;

    const exportFilters = useAllOccurrences
      ? { ...(filters || {}), dataset: { status: 'Approved' } }
      : filters || {};

    // Total for progress: a COUNT when filtering, the ID count otherwise
    let total: number;
    if (useAllOccurrences) {
      total = await this.repository.count({
        where: exportFilters,
      });
      if (total === 0) total = 1;
    } else {
      total = Math.max(approvedIds.length, 1);
    }

    let page = 0;
    let entities: any[] = [];

    while (true) {
      const skip = page * pageSize;

      if (useAllOccurrences) {
        entities = await this.repository.find({
          where: exportFilters,
          relations: EXPORT_RELATIONS as any,
          relationLoadStrategy: 'join',
          order: { id: 'ASC' },
          skip,
          take: pageSize,
        });
        if (!entities.length) break;
      } else {
        const ids = approvedIds.slice(skip, skip + pageSize);
        if (!ids.length) break;

        entities = await this.repository.find({
          where: { id: In(ids) as any },
          relations: EXPORT_RELATIONS as any,
          relationLoadStrategy: 'join',
          order: { id: 'ASC' },
        });
        if (!entities.length) break;
      }

      for (const entity of entities) {
        const row = this.mapEntityToRow(entity, sortedColumns, relationIndex);
        worksheet.addRow(row).commit();
      }

      page++;
      if (updateProgressCallback && exportJob) {
        const progress = Math.round(
          (Math.min(page * pageSize, total) / total) * 85,
        );
        updateProgressCallback(exportJob.id, progress);
      }

      // Lets other requests run during long exports
      if (page % yieldAfter === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }
    }

    await this.makeFiltersAndDOISheet(
      workbook,
      filters,
      generateDoi,
      exportJob,
    );

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

    this.logger.debug(
      `makeFiltersAndDOISheet filters: ${JSON.stringify(filters)}`,
    );
    if (filters) {
      this.logger.debug(`Processing ${Object.keys(filters).length} filters`);
      Object.keys(filters).forEach((element) => {
        const val = filters[element];
        let displayValue = val;
        if (Array.isArray(val)) {
          displayValue = val.join(', ');
        } else if (typeof val === 'object' && val !== null) {
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
          displayValue = new Date(val).toISOString().split('T')[0];
        }
        this.logger.debug(`Adding filter row: ${element}=${displayValue}`);
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
