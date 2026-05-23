import { MigrationInterface, QueryRunner } from 'typeorm';

export class UploadedDatasetIngestionTrackingFields1778735811063
  implements MigrationInterface
{
  name = 'UploadedDatasetIngestionTrackingFields1778735811063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD "ingestion_status" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD "ingestion_errors" text
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD "total_ingested_rows" integer DEFAULT '0'
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD "ingestion_progress" double precision DEFAULT '0'
    `);

    // DO NOT TOUCH reference PRIMARY KEY
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN "ingestion_progress"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN "total_ingested_rows"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN "ingestion_errors"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN "ingestion_status"
    `);
  }
}