import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReference21775824189450 implements MigrationInterface {
  name = 'FixReference21775824189450';

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Remove old FK constraints safely
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP CONSTRAINT IF EXISTS "FK_occurrence_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP CONSTRAINT IF EXISTS "FK_bionomics_reference"
    `);

    // Remove old export job indexes safely
    await queryRunner.query(`
      DROP INDEX IF EXISTS "public"."IDX_exportJob_requestHash"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "public"."IDX_exportJob_status"
    `);

    // IMPORTANT FIX:
    // DO NOT DROP OR MODIFY ANY CONSTRAINT ON "reference"
    // (removed: UQ + FK + any implicit schema assumptions)

    // Recreate foreign keys cleanly
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD CONSTRAINT "FK_occurrence_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD CONSTRAINT "FK_bionomics_reference"
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
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

    // restore old indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exportJob_status"
      ON "exportJob" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exportJob_requestHash"
      ON "exportJob" ("requestHash")
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