import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntityTarget,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import * as crypto from 'crypto';
import { DynamicRelationLoader } from '../shared/dynamic-relation-loader';
import * as ExcelJS from 'exceljs';
import * as fss from 'fs';
import * as path from 'path';
import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { DynamicQueryService } from './dynamic-query.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RawTemplateFieldMap } from '../occurrence/template-mapping';
import {
  ApprovalStatus,
  DOISourceType,
  numberTypeResolver,
} from 'src/commonTypes';
import { DOI } from '../doi/entities/doi.entity';
import { formatDate } from 'src/utils';
import { DoiService } from '../doi/doi.service';
import { ExportJob } from 'src/exports/export-job.entity';

type RelationNode = {
  name: string;
  target: any;
  children: Map<string, RelationNode>;
  foreignKeyTable: string;
  sourceTable: string;
};

type RelationIndexNode = {
  tableName: string;
  relationName: string;
  entityName: string;
  children: Map<string, RelationIndexNode>;
};

const AZURE_EXPORTS_DIRECTORY =
  process.env.AZURE_EXPORTS_DIRECTORY || 'exports';

@Injectable()
/**
 * See https://gemini.google.com/app/b46cbee50bf1e574
 */
export class DynamicExportService<Occurrence> {
  // private repository: Repository<Occurrence>;

  constructor(
    // private readonly datasource: DataSource,

    // private entity: EntityTarget<T>,
    // private readonly dynamicQueryService: DynamicQueryService,

    @InjectRepository(Occurrence)
    private readonly repository: Repository<Occurrence>,

    private readonly doiService: DoiService,
  ) {
    // Get repository for the given entity
    // this.repository = this.datasource.getRepository(Occurrence);
  }
  buildRelationMap(
    repository: Repository<any>,
    maxDepth = 5,
  ): Map<string, RelationNode> {
    const visited = new Set<string>();

    const build = (
      repo: Repository<any>,
      depth: number,
    ): Map<string, RelationNode> => {
      const map = new Map<string, RelationNode>();

      if (depth > maxDepth) {
        return map;
      }

      const entityName = repo.metadata.name;

      if (visited.has(entityName)) {
        return map;
      }

      visited.add(entityName);

      for (const relation of repo.metadata.relations) {
        const relationName = relation.propertyName;
        if (relationName === 'recordedSpecies') {
          console.log('Here');
        }

        const targetRepo = repo.manager.getRepository(
          relation.inverseEntityMetadata.target,
        );

        const node: RelationNode = {
          name: relationName,
          target: relation.inverseEntityMetadata.target,
          children: build(targetRepo, depth + 1),
          foreignKeyTable: repo.metadata.tableName,
          sourceTable: targetRepo.metadata.tableName,
        };

        map.set(relationName, node);
      }

      return map;
    };

    return build(repository, 3);
  }

  resolveWithMetadataTree(
    entity: any,
    relationPath: string,
    field: string,
    relationMap: Map<string, any>,
  ) {
    const parts = relationPath.split('.');

    let current = entity;
    let currentMap = relationMap;

    for (const part of parts) {
      if (!current) return undefined;

      const node = currentMap.get(part);

      if (!node) {
        current = current?.[part];
        continue;
      }

      current = current?.[part];
      currentMap = node.children;
    }

    return current?.[field];
  }

  buildRelationIndex(
    repository: Repository<any>,
    maxDepth = 5,
  ): Map<string, RelationIndexNode> {
    const visited = new Set<string>();

    function build(
      repo: Repository<any>,
      depth: number,
    ): Map<string, RelationIndexNode> {
      const map = new Map<string, RelationIndexNode>();

      if (depth > maxDepth) {
        return map;
      }

      const entityName = repo.metadata.name;

      const visitKey = `${entityName}_${depth}`;

      if (visited.has(visitKey)) {
        return map;
      }

      visited.add(visitKey);

      for (const relation of repo.metadata.relations) {
        const targetRepo = repo.manager.getRepository(
          relation.inverseEntityMetadata.target,
        );

        const metadata = relation.inverseEntityMetadata;

        const node: RelationIndexNode = {
          relationName: relation.propertyName,

          // entity class name
          entityName: metadata.name,

          // actual DB table name
          tableName: metadata.tableName,

          children: build(targetRepo, depth + 1),
        };

        map.set(relation.propertyName, node);
      }

      return map;
    }

    return build(repository, 1);
  }

  findValueByTable(
    entity: any,
    tableName: string,
    fieldName: string,
    relationIndex: Map<string, RelationIndexNode>,
    visited = new Set<any>(),
  ): any {
    if (!entity) {
      return undefined;
    }

    if (visited.has(entity)) {
      return undefined;
    }

    visited.add(entity);

    const normalizedTable = tableName?.replace(/"/g, '')?.toLowerCase();

    for (const [relationKey, relationNode] of relationIndex.entries()) {
      const relationValue = entity?.[relationKey];

      if (!relationValue) {
        continue;
      }

      const entityMatch =
        relationNode.entityName?.toLowerCase() === normalizedTable;

      const tableMatch =
        relationNode.tableName?.toLowerCase() === normalizedTable;

      // MATCH FOUND
      if (entityMatch || tableMatch) {
        if (Array.isArray(relationValue)) {
          return relationValue
            .map((item) => item?.[fieldName])
            .filter((v) => v !== undefined)
            .join(', ');
        }

        return relationValue?.[fieldName];
      }

      // recurse arrays
      if (Array.isArray(relationValue)) {
        for (const item of relationValue) {
          const result = this.findValueByTable(
            item,
            tableName,
            fieldName,
            relationNode.children,
            visited,
          );

          if (result !== undefined) {
            return result;
          }
        }

        continue;
      }

      // recurse object
      const result = this.findValueByTable(
        relationValue,
        tableName,
        fieldName,
        relationNode.children,
        visited,
      );

      if (result !== undefined) {
        return result;
      }
    }

    return undefined;
  }

  flattenRelationIndexMap(
    nodes: Map<string, RelationNode>,
    parentPath = '',
    result: Record<string, any> = {},
  ): Record<string, any> {
    for (const [key, node] of nodes.entries()) {
      // const path = parentPath ? `${parentPath}.${node.name}` : node.name;
      // result[path] = node.target;
      if (key === 'recordedSpecies') {
        console.log('r species');
      }
      const path = parentPath ? `${parentPath}.${key}` : key;
      result[path] = {
        relationPropertyName: key,
        entityName: node.target.name,
        foreignKeyTable: node.foreignKeyTable,
        sourceTable: node.sourceTable,
      };

      this.flattenRelationIndexMap(node.children, path, result);
    }

    return result;
  }

  findRelationValue(
    entity: any,
    relationName: string,
    field: string,
    relationIndex: Set<string>,
  ): any {
    if (!entity) return undefined;

    // direct match
    if (entity?.[relationName]) {
      const target = entity[relationName];

      if (Array.isArray(target)) {
        return target.map((t) => t?.[field]).filter(Boolean);
      }

      return target?.[field];
    }

    // recursive search through object graph
    for (const key of Object.keys(entity)) {
      const value = entity[key];

      if (!value) continue;

      // only traverse objects that look like relations
      if (typeof value === 'object') {
        const result = this.findRelationValue(
          value,
          relationName,
          field,
          relationIndex,
        );

        if (result !== undefined) {
          return result;
        }
      }
    }

    return undefined;
  }

  mapEntityToRow(
    entity: any,
    columns: any[],
    relationIndex: Map<string, RelationIndexNode>,
    baseTableName = 'occurrence',
  ) {
    const row: any = {};

    for (const col of columns) {
      const tableName = col.table;

      const fieldName = col.table_field;

      // direct field
      if (!tableName || tableName === baseTableName) {
        row[col.template_field] = entity?.[fieldName];

        continue;
      }

      // dynamic nested relation lookup
      row[col.template_field] = this.findValueByTable(
        entity,
        tableName,
        fieldName,
        relationIndex,
      );
    }

    return row;
  }

  resolveDynamicRelationValue(
    entity: any,
    relationPath: string,
    field: string,
  ) {
    if (!entity || !relationPath) {
      return entity?.[field];
    }

    const relation = relationPath
      .split('.')
      .reduce((acc, key) => acc?.[key], entity);

    return relation?.[field];
  }

  async exportAllToExcel(
    // loader: any,
    columns: RawTemplateFieldMap[],
    fileName = 'export.xlsx',
    pageSize = 500,
    excludeColumns: string[],
  ): Promise<Buffer> {
    const loader = new DynamicRelationLoader(
      this.repository,
      //3, // max Depth
    );
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Export');

    const sortedColumns = [...columns]
      .filter((a) => !excludeColumns.includes(a.template_field))
      .sort((a, b) => a.sequence - b.sequence);

    const relationIndex = this.buildRelationIndex(this.repository);
    /**
     * Header row
     */
    worksheet.columns = sortedColumns.map((col) => ({
      header: col.template_field,
      key: col.template_field,
      width: 30,
    }));

    let page = 0;

    while (true) {
      const entities = await loader.find({
        take: pageSize,
        skip: page * pageSize,
        order: {
          id: 'ASC',
        },
      });

      if (!entities.length) {
        break;
      }

      /**
       * Add rows
       */
      for (const entity of entities) {
        const row = this.mapEntityToRow(entity, sortedColumns, relationIndex);

        worksheet.addRow(row);
      }

      page++;
    }

    // const buffer = await workbook.xlsx.writeBuffer();

    // return Buffer.from(buffer);
    // -----------------------------
    // SAVE TO DISK
    // -----------------------------

    const exportDir = path.join(process.cwd(), AZURE_EXPORTS_DIRECTORY);

    if (!fss.existsSync(exportDir)) {
      fss.mkdirSync(exportDir, {
        recursive: true,
      });
    }

    const filePath = path.join(exportDir, fileName);

    await workbook.xlsx.writeFile(filePath);

    // return filePath;
    return null as Buffer;
  }

  async exportAllToExcelBackground(
    // loader: any,
    filters: any,
    columns: RawTemplateFieldMap[],
    fileName = 'export.xlsx',
    pageSize = 200,
    exportJob: ExportJob = null,
    updateProgressCallback = undefined,
    saveToDisk = false,
    excludeColumns: string[] = [],
    occurrenceIds: string[] = [],
    generateDoi = false,
  ): Promise<Buffer | string> {
    /**
     * Make a filters + DOI sheet
     */
    const makeFiltersAndDOISheet = async () => {
      // Second worksheet
      const sheet2 = workbook.addWorksheet('Filters & DOI');
      // const rows = Array<string>();
      // const colCount = headers.split(',').length;

      // Add header row
      sheet2.addRow(['Filters', '']);
      const headerRow = sheet2.getRow(1);
      // headerRow.font = {
      //   bold: true,
      //   size: 12,
      //   color: { argb: 'FF0000' }, // red
      // };

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' },
        };

        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' },
        };
      });

      if (filters) {
        // rows.push('Filters:' + ','.repeat(colCount - 1));
        Object.keys(filters).forEach((element) => {
          const val = filters[element];
          // rows.push(`,${element},${val}` + ','.repeat(colCount - 3));
          sheet2.addRow([element, val]);
        });

        // generate DOI
        if (generateDoi) {
          // Add an empty row
          sheet2.addRow([]);
          const downloaderEmail = exportJob ? exportJob.downloaderEmail : null;
          const downloaderName = exportJob ? exportJob.downloaderName : null;
          const doi = await saveDOI(downloaderEmail, downloaderName, exportJob);
          // rows.push(`DOI:,${doi.doi_link}` + ','.repeat(colCount - 3));
          sheet2.addRow(['DOI:', doi.doi_link]);

          const doiRow = sheet2.getRow(2);
          doiRow.font = {
            // bold: true,
            size: 12,
            color: { argb: '0000FF' }, // blue
          };
        }
      }
      // return rows;
    };

    const saveDOI = async (
      downloaderEmail: string,
      downloaderName: string,
      exportJob: ExportJob,
    ) => {
      const doi = new DOI();
      doi.creator_email = downloaderEmail;
      doi.creator_name = downloaderName;
      doi.publication_year = new Date().getFullYear();
      doi.title = 'Data Download - ' + formatDate(new Date());
      doi.approval_status = ApprovalStatus.PENDING;
      doi.description =
        'Data downloaded with filters: ' + JSON.stringify(filters);
      doi.source_type = DOISourceType.DOWNLOAD;
      doi.meta_data = {
        // fields: headers.toLowerCase().split(','),
        fields: [],
        filters: filters,
      };
      doi.export_job = exportJob;
      let res = await this.doiService.upsert(doi);
      if (res) {
        res = await this.doiService.approveDOI(doi.id, downloaderEmail);
      }
      return res;
    };

    const loader = new DynamicRelationLoader(
      this.repository,
      //3, // max Depth
    );
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Data');

    const sortedColumns = [...columns]
      .filter((a) => !excludeColumns.includes(a.template_field))
      .sort((a, b) => a.sequence - b.sequence);

    const relationIndex = this.buildRelationIndex(this.repository);
    /**
     * Header row
     */
    worksheet.columns = sortedColumns.map((col) => ({
      header: col.template_field,
      key: col.template_field,
      width: 30,
    }));
    const approvedIds = occurrenceIds;

    const total = Math.max(approvedIds.length, 10);

    // const total = await this.repository.count();
    let page = 0;
    while (true) {
      const skip = page * pageSize;
      const ids = approvedIds.slice(skip, skip + pageSize);
      if (!ids.length) {
        break;
      }
      const entities = await loader.find({
        where: { id: In(ids) },
        order: {
          // Order to make it predictable
          id: 'ASC',
        },
      });

      console.log(
        `Approved occurrence ids length: ${ids.length}. Page ${page + 1}`,
      );
      console.log(`Entities page: , ${page + 1}, ${entities.length}`);

      if (!entities.length) {
        break;
      }

      /**
       * Add rows
       */
      for (const entity of entities) {
        const row = this.mapEntityToRow(entity, sortedColumns, relationIndex);
        worksheet.addRow(row);
      }

      page++;
      if (updateProgressCallback) {
        // const total = 40000; // || 1;
        const skip = page * pageSize;
        const progress = Math.round((Math.min(skip, total) / total) * 85);
        updateProgressCallback(exportJob.id, progress);
      }
    }

    // Add filters + DOI worksheet
    await makeFiltersAndDOISheet();

    if (!saveToDisk) {
      const buffer = await workbook.xlsx.writeBuffer();

      return Buffer.from(buffer);
    } else {
      // -----------------------------
      // SAVE TO DISK
      // -----------------------------
      const exportDir = path.join(process.cwd(), AZURE_EXPORTS_DIRECTORY);

      if (!fss.existsSync(exportDir)) {
        fss.mkdirSync(exportDir, {
          recursive: true,
        });
      }

      let fName = fileName || Date.now().toString();
      // const parts = (fleName || Date.now().toString()).split("/")
      // const extension = parts.pop().split(".").pop()

      const parts = (fileName || Date.now().toString()).split('.');
      if (parts.length > 1) {
        parts.pop(); // remove extension
      }
      parts.push('xlsx');
      fName = parts.join('.');

      const filePath = path.join(exportDir, fName);
      await workbook.xlsx.writeFile(filePath);

      return filePath;
    }
  }
}
