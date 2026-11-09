// src/dataset/dataset.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { AuthService } from 'src/auth/auth.service';
import { OccurrenceService } from '../occurrence/occurrence.service';
@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    private authService: AuthService,
    private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    datasetId: string,
    dataType: string,
    dataSource: string,
    doi: string,
    description: string,
    title: string,
    location: string,
    createdBy: string,
    region: string,
  ): Promise<Dataset> {
    if (!file) {
      this.logger.error('No file uploaded.');
      throw new BadRequestException('No file uploaded.');
    }

    // Simulate uploading to a blob store and return a URL.
    const blobUrl = await this.uploadToBlobStore(file);

    // Save the metadata to the database.
    const newDataset = this.datasetRepository.create({
      dataType,
      dataSource,
      doi,
      description,
      title,
      location,
      region,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      UpdatedBy: createdBy,
      UpdatedAt: new Date(),
      status: 'Uploaded',
    });

    return this.datasetRepository.save(newDataset);
  }

  async uploadToBlobStore(file: Express.Multer.File): Promise<string> {
    console.log(`Uploading ${file.originalname} to blob store...`);
    return `https://blobstore.example.com/${file.originalname}`;
  }

  async findOneById(id: string): Promise<Dataset> {
    await this.authService.init();
    const dataset = await this.datasetRepository.findOne({ where: { id } });
    if (dataset) {
      dataset.UpdatedBy = await this.authService.getEmailFromUserId(
        dataset.UpdatedBy || 'N/A',
      );
    }
    return dataset;
  }

  async findAll(): Promise<Dataset[]> {
    return await this.datasetRepository.find({
      order: {
        UpdatedAt: 'DESC', // Optional: sorts the results by update time
      },
    });
  }

  async updateUploadedDatasetId(
    id: string,
    uploadedDataset: UploadedDataset,
  ): Promise<Dataset> {
    await this.authService.init();
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
    });
    dataset.uploaded_dataset = uploadedDataset;
    dataset.status = 'Approved';
    this.datasetRepository.save(dataset);
    return dataset;
  }

  async getDatasetByUploadedDatasetId(
    uploadedDatasetId: string,
  ): Promise<Dataset> {
    const ds: Dataset = await this.entityManager
      .createQueryBuilder(Dataset, 'dataset')
      .select()
      .where('dataset.uploadedDatasetId= :uploadedDatasetId', {
        uploadedDatasetId: uploadedDatasetId,
      })
      .getOne();

    return ds;
  }

  async removeByUploadedDatasetId(
    uploadedDatasetId: string,
  ): Promise<Dataset | Dataset[] | null> {
    const ds: Dataset = await this.entityManager
      .createQueryBuilder(Dataset, 'dataset')
      .select()
      .where('dataset.uploadedDatasetId= :uploadedDatasetId', {
        uploadedDatasetId: uploadedDatasetId,
      })
      .getOne();
    if (ds) {
      const dataset = await this.datasetRepository.findOne({
        where: { id: ds.id },
      });
      dataset.uploaded_dataset = null;
      dataset.status = 'Ingestion Failed';
      await this.datasetRepository.save(dataset);

      return await this.datasetRepository.remove(ds);
    }
    return null;
  }

  async remove(id: string) {
    // delete occurrence
    const ds: Dataset = await this.datasetRepository.findOne({
      where: { id },
    });
    if (ds) {
      return this.datasetRepository.remove(ds);
    }
  }

  /**
   * Delete a dataset and all rows that belong exclusively to it.
   *
   * Idempotent ("do nothing" when the id does not exist). Deduped/shared rows
   * (site, reference, sample, recorded_species) are only removed when no other
   * dataset's occurrences/bionomics still reference them. Lookup tables
   * (country, species, ...) are never touched.
   */
  async deleteDatasetData(id: string) {
    const ds: Dataset = await this.datasetRepository.findOne({
      where: { id },
    });
    if (!ds) {
      return { deleted: false, reason: 'dataset not found' };
    }

    const qr = this.entityManager.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // snapshot the dataset's occurrences and their linked rows
      await qr.query(
        `CREATE TEMP TABLE del_occ AS
         SELECT id, "bionomicsId", "insecticideResistanceBioassaysId",
                "sampleId", "recordedSpeciesId", "referenceId", "siteId"
         FROM occurrence WHERE "datasetId" = $1`,
        [id],
      );

      // helper: delete rows of every table that has a FK to $parentTable, restricted to parent ids
      const deleteChildren = async (
        parentTable: string,
        parentIdsSql: string,
      ) => {
        const children: { table_name: string; column_name: string }[] =
          await qr.query(
            `SELECT tc.table_name, kcu.column_name
             FROM information_schema.table_constraints tc
             JOIN information_schema.key_column_usage kcu
               ON tc.constraint_name = kcu.constraint_name AND tc.table_name = kcu.table_name
             JOIN information_schema.constraint_column_usage ccu
               ON tc.constraint_name = ccu.constraint_name
             WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
               AND ccu.table_name = $1`,
            [parentTable],
          );
        for (const c of children) {
          await qr.query(
            `DELETE FROM "${c.table_name}" WHERE "${c.column_name}" IN (${parentIdsSql})`,
          );
        }
      };

      // 1. bionomics detail children, then bionomics rows
      await deleteChildren(
        'bionomics',
        'SELECT "bionomicsId" FROM del_occ WHERE "bionomicsId" IS NOT NULL',
      );
      await qr.query(
        'DELETE FROM bionomics WHERE id IN (SELECT "bionomicsId" FROM del_occ WHERE "bionomicsId" IS NOT NULL)',
      );

      // 2. IR bioassay detail children, then the IR bioassay rows
      await deleteChildren(
        'insecticideResistanceBioassays',
        'SELECT "insecticideResistanceBioassaysId" FROM del_occ WHERE "insecticideResistanceBioassaysId" IS NOT NULL',
      );
      await qr.query(
        'DELETE FROM "insecticideResistanceBioassays" WHERE id IN (SELECT "insecticideResistanceBioassaysId" FROM del_occ WHERE "insecticideResistanceBioassaysId" IS NOT NULL)',
      );

      // 3. the occurrences themselves
      await qr.query('DELETE FROM occurrence WHERE "datasetId" = $1', [id]);

      // 4. orphan-only cleanup of deduped rows still linked from del_occ.
      //    "Do nothing" for rows still referenced by other datasets.
      //    (Precompute the still-referenced id sets once — occurrence has no
      //    index on the FK columns, so per-row NOT EXISTS would be O(n^2).)
      await qr.query(
        'CREATE TEMP TABLE used_sample AS SELECT DISTINCT "sampleId" AS id FROM occurrence WHERE "sampleId" IS NOT NULL',
      );
      await qr.query(
        'CREATE TEMP TABLE used_recorded_species AS SELECT DISTINCT "recordedSpeciesId" AS id FROM occurrence WHERE "recordedSpeciesId" IS NOT NULL',
      );
      await qr.query(
        `CREATE TEMP TABLE used_reference AS
         SELECT "referenceId" AS id FROM occurrence WHERE "referenceId" IS NOT NULL
         UNION SELECT "referenceId" FROM bionomics WHERE "referenceId" IS NOT NULL`,
      );
      await qr.query(
        `CREATE TEMP TABLE used_site AS
         SELECT "siteId" AS id FROM occurrence WHERE "siteId" IS NOT NULL
         UNION SELECT "siteId" FROM bionomics WHERE "siteId" IS NOT NULL`,
      );
      await qr.query(
        `DELETE FROM sample WHERE id IN (
           SELECT d.id FROM (SELECT DISTINCT "sampleId" AS id FROM del_occ WHERE "sampleId" IS NOT NULL) d
           LEFT JOIN used_sample u ON u.id = d.id WHERE u.id IS NULL)`,
      );
      await qr.query(
        `DELETE FROM recorded_species WHERE id IN (
           SELECT d.id FROM (SELECT DISTINCT "recordedSpeciesId" AS id FROM del_occ WHERE "recordedSpeciesId" IS NOT NULL) d
           LEFT JOIN used_recorded_species u ON u.id = d.id WHERE u.id IS NULL)`,
      );
      await qr.query(
        `DELETE FROM reference WHERE id IN (
           SELECT d.id FROM (SELECT DISTINCT "referenceId" AS id FROM del_occ WHERE "referenceId" IS NOT NULL) d
           LEFT JOIN used_reference u ON u.id = d.id WHERE u.id IS NULL)`,
      );
      await qr.query(
        `DELETE FROM site WHERE id IN (
           SELECT d.id FROM (SELECT DISTINCT "siteId" AS id FROM del_occ WHERE "siteId" IS NOT NULL) d
           LEFT JOIN used_site u ON u.id = d.id WHERE u.id IS NULL)`,
      );

      // 5. the dataset row itself
      await qr.query('DELETE FROM dataset WHERE id = $1', [id]);

      await qr.query('DROP TABLE del_occ');
      await qr.commitTransaction();
      return { deleted: true, datasetId: id };
    } catch (e) {
      await qr.rollbackTransaction();
      this.logger.error(`Failed to delete dataset ${id}: ${e}`);
      throw e;
    } finally {
      await qr.release();
    }
  }

  async findOneByIdWithChildren(id: string): Promise<Dataset | null> {
    const dataset = await this.datasetRepository.findOne({
      where: { id },
      relations: ['bionomics', 'occurrence'],
    });
    return dataset || null;
  }
}
