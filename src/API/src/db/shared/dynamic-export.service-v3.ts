import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
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

const AZURE_EXPORTS_DIRECTORY =
  process.env.AZURE_EXPORTS_DIRECTORY || 'exports';

/**
 * Non-circular relation tree for the data export.
 *
 * Same tree as v2 — see docs/export-relation-tree.md for the full diagram.
 * Each relation property name maps to a DB table name; this is used to
 * build the table-name-to-alias lookup that drives the raw SELECT.
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

/**
 * Maps a relation property name (used in the query builder JOIN) to its
 * DB table name (used in the field mapping). Built from the Occurrence
 * entity's TypeORM metadata.
 *
 * Example: { reference: 'reference', recordedSpecies: 'recorded_species', ... }
 */
type TableAliasMap = Record<string, string>;

@Injectable()
export class DynamicExportServiceV3<T = Occurrence> {
  private readonly logger = new Logger(DynamicExportServiceV3.name);
  constructor(
    @InjectRepository(Occurrence)
    private readonly repository: Repository<Occurrence>,
    private readonly doiService: DoiService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Walk the EXPORT_RELATIONS tree and the entity metadata to build:
   * 1. A set of leftJoin calls on the query builder
   * 2. A map from DB table name -> query alias for SELECT column resolution
   *
   * Each joined table gets the relation property name as its alias.
   * The base table (occurrence) gets alias 'occurrence'.
   */
  private buildJoinsAndAliasMap(
    qb: SelectQueryBuilder<any>,
    relations: Record<string, any>,
    parentAlias: string,
    parentEntityTarget: any,
    tableAliasMap: TableAliasMap,
  ): void {
    // Use the repository's connection metadata (same DataSource as the query builder)
    // rather than this.dataSource which may be a different instance in NestJS DI.
    const metadata =
      this.repository.manager.connection.getMetadata(parentEntityTarget);

    for (const [relName, nested] of Object.entries(relations)) {
      const relation = metadata.relations.find(
        (r) => r.propertyName === relName,
      );
      if (!relation) {
        this.logger.warn(`Relation '${relName}' not found on ${metadata.name}`);
        continue;
      }

      const targetEntity = relation.inverseEntityMetadata.target;
      const tableName = relation.inverseEntityMetadata.tableName;

      // Use the relation property name as the alias
      const alias = relName;
      tableAliasMap[tableName] = alias;

      // Join: parentAlias.relationName -> alias
      qb.leftJoin(`${parentAlias}.${relName}`, alias);

      // Recurse into nested relations
      if (typeof nested === 'object' && nested !== null) {
        this.buildJoinsAndAliasMap(
          qb,
          nested,
          alias,
          targetEntity,
          tableAliasMap,
        );
      }
    }
  }

  /**
   * Build the SELECT clause using the field mapping and the table alias map.
   *
   * Each field mapping entry has: { template_field, table, table_field }.
   * We select `${alias}.${table_field} AS ${template_field}`.
   *
   * For the base table (occurrence or empty table name), we use the base alias.
   * For duplicate table.table_field pairs (e.g., biting_activity.notes maps to
   * both biting_notes and resting_notes), each gets its own alias — this is valid
   * because we SELECT the same column twice under different output names.
   */
  private addSelects(
    qb: SelectQueryBuilder<any>,
    columns: RawTemplateFieldMap[],
    tableAliasMap: TableAliasMap,
    baseAlias: string,
    baseEntityTarget: any,
  ): void {
    // Get the base entity's actual column names from TypeORM metadata
    // so we can skip fields mapped to 'occurrence' that don't exist there
    // (e.g., larval_site_data is mapped to occurrence but lives on bionomics).
    // v2 silently returned undefined for these; v3 must skip them to avoid
    // a SQL "column does not exist" error.
    const baseMetadata =
      this.repository.manager.connection.getMetadata(baseEntityTarget);
    const baseColumnNames = new Set(
      baseMetadata.columns.map((c) => c.databaseName),
    );

    for (const col of columns) {
      const tableName = (col.table || '').replace(/"/g, '');
      const fieldName = col.table_field;

      // Skip entries with no table_field (e.g., binary_absence has an empty
      // mapping — the v2 code handled this by returning undefined from
      // mapEntityToRow, which produces an empty column in the output).
      if (!fieldName) {
        continue;
      }

      let alias: string;
      if (!tableName || tableName === 'occurrence') {
        // Skip columns that don't exist on the base table — v2 would have
        // returned undefined (empty cell) for these.
        if (!baseColumnNames.has(fieldName)) {
          continue;
        }
        alias = baseAlias;
      } else {
        alias = tableAliasMap[tableName];
        if (!alias) {
          this.logger.warn(
            `No alias found for table '${tableName}' (field: ${col.template_field})`,
          );
          continue;
        }
      }

      // Quote the column name to handle identifiers starting with digits
      // (e.g., biting_activity has columns like "18_00_19_00_indoor" that
      // PostgreSQL would otherwise parse as a numeric literal).
      // Double-quoting is standard SQL and works for all valid column names.
      qb.addSelect(`${alias}."${fieldName}"`, col.template_field);
    }
  }

  /**
   * Main memory-efficient background exporter. Writes directly to disk stream.
   *
   * v3: Uses a raw QueryBuilder with leftJoin + addSelect + getRawMany to
   * fetch flat rows directly, eliminating the entity hydration and
   * mapEntityToRow/findValueByTable overhead from v2.
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

    this.logger.log(`[V3] Using pageSize of ${pageSize}`);

    const finalPath =
      targetFilePath ||
      path.join(exportDir, `va_export_${exportJob?.id || Date.now()}.xlsx`);

    // 1. Initialize Streaming Workbook Writer directly to local file
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

    // 2. Add columns and flush header row
    worksheet.columns = sortedColumns.map((col) => ({
      header: col.template_field,
      key: col.template_field,
    }));
    worksheet.getRow(1).commit();

    const approvedIds = occurrenceIds || [];
    const useAllOccurrences = !approvedIds || approvedIds.length === 0;

    // Get the true total row count for accurate progress reporting
    let total: number;
    if (useAllOccurrences) {
      total = await this.repository.count({ where: filters || {} });
      if (total === 0) total = 1;
    } else {
      total = Math.max(approvedIds.length, 1);
    }

    // 3. Build the base query builder
    const baseAlias = 'occurrence';
    let page = 0;

    while (true) {
      const skip = page * pageSize;
      const qb = this.repository
        .createQueryBuilder(baseAlias)
        .skip(skip)
        .take(pageSize)
        .orderBy(`${baseAlias}.id`, 'ASC');

      // Build all joins and the table-name -> alias lookup
      const tableAliasMap: TableAliasMap = {};
      tableAliasMap['occurrence'] = baseAlias;
      this.buildJoinsAndAliasMap(
        qb,
        EXPORT_RELATIONS,
        baseAlias,
        Occurrence,
        tableAliasMap,
      );

      // Build the SELECT clause — only the fields we need, aliased to template_field names
      this.addSelects(qb, sortedColumns, tableAliasMap, baseAlias, Occurrence);

      // Apply WHERE clause
      if (useAllOccurrences) {
        if (filters && Object.keys(filters).length > 0) {
          // Apply filter conditions on the base alias
          // We use a simple approach: for each filter key, add AND condition
          for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null) {
              const paramKey = `filter_${key}`;
              if (Array.isArray(value)) {
                qb.andWhere(`${baseAlias}.${key} IN (:...${paramKey})`, {
                  [paramKey]: value,
                });
              } else {
                qb.andWhere(`${baseAlias}.${key} = :${paramKey}`, {
                  [paramKey]: value,
                });
              }
            }
          }
        }
      } else {
        const ids = approvedIds.slice(skip, skip + pageSize);
        if (!ids.length) break;
        qb.andWhere(`${baseAlias}.id IN (:...ids)`, { ids });
      }

      // Execute — getRawMany returns flat objects keyed by our template_field aliases
      const rows = await qb.getRawMany<Record<string, any>>();
      if (!rows.length) break;

      // Write rows directly to Excel — no mapping needed
      for (const row of rows) {
        worksheet.addRow(row).commit();
      }

      page++;
      if (updateProgressCallback && exportJob) {
        const progress = Math.round(
          (Math.min(page * pageSize, total) / total) * 85,
        );
        updateProgressCallback(exportJob.id, progress);
      }

      // Yield every x pages to give the event loop room
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

    if (filters) {
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
