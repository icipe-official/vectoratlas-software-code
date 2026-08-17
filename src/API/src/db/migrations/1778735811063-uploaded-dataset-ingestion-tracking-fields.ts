import { MigrationInterface, QueryRunner } from 'typeorm';

export class UploadedDatasetIngestionTrackingFields1778735811063
  implements MigrationInterface {
  name = 'UploadedDatasetIngestionTrackingFields1778735811063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
     ADD COLUMN IF NOT EXISTS "ingestion_status" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD COLUMN IF NOT EXISTS "ingestion_errors" text 
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD COLUMN IF NOT EXISTS "total_ingested_rows" integer DEFAULT '0' 
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD COLUMN IF NOT EXISTS "ingestion_progress" double precision DEFAULT '0' 
    `);

    // DO NOT TOUCH reference PRIMARY KEY
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_progress"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "total_ingested_rows"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_errors"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_status"
    `);
  }
}
