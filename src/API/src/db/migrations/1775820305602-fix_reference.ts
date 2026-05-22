import { MigrationInterface, QueryRunner } from "typeorm";


// CHANGE THIS LINE to match the file's timestamp/intent
export class FixReference1775820305602 implements MigrationInterface {
  // CHANGE THIS LINE TOO
  name = 'FixReference1775820305602';

  public async up(queryRunner: QueryRunner): Promise<void> {

    // uploaded_dataset ingestion tracking
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
      ADD COLUMN IF NOT EXISTS "total_ingested_rows" integer DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      ADD COLUMN IF NOT EXISTS "ingestion_progress" double precision DEFAULT 0
    `);

    // IMPORTANT: DO NOT TOUCH reference primary key (removed entirely)

    // Clean legacy columns
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP COLUMN IF EXISTS "referenceNumId"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP COLUMN IF EXISTS "referenceNumId"
    `);

    // Recreate foreign keys safely (ensure no duplicates)
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP CONSTRAINT IF EXISTS "FK_occurrence_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP CONSTRAINT IF EXISTS "FK_bionomics_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD CONSTRAINT "FK_occurrence_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD CONSTRAINT "FK_bionomics_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP CONSTRAINT IF EXISTS "FK_bionomics_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP CONSTRAINT IF EXISTS "FK_occurrence_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_status"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_errors"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "total_ingested_rows"
    `);

    await queryRunner.query(`
      ALTER TABLE "uploaded_dataset"
      DROP COLUMN IF EXISTS "ingestion_progress"
    `);

    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD COLUMN IF NOT EXISTS "referenceNumId" integer
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD COLUMN IF NOT EXISTS "referenceNumId" integer
    `);

    // restore original FK style
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD CONSTRAINT "FK_occurrence_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD CONSTRAINT "FK_bionomics_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
  }
}