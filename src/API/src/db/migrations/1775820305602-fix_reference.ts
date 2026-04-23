import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReference1775820305602 implements MigrationInterface {
  name = 'FixReference1775820305602'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Fix duplicate sequence on reference.num_id
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS "reference_id_seq" OWNED BY NONE
    `);

    await queryRunner.query(`
      DROP SEQUENCE IF EXISTS "reference_id_seq"
    `);

    // 1. Drop the extra primary key constraint on num_id
    //    (id from BaseEntity is the true PK — num_id should just be a plain auto-increment column)
    await queryRunner.query(`
      ALTER TABLE "reference" DROP CONSTRAINT IF EXISTS "PK_01bacbbdd90839b7dce352e4250"
    `);

    // 2. Drop old foreign keys
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP CONSTRAINT IF EXISTS "FK_69457bf7344e306225f91c5bb76"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP CONSTRAINT IF EXISTS "FK_c16633f8b002bd154c433959095"
    `);

    // 3. Safe column rename
    await queryRunner.query(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='genotypicRepresentativeness'
      AND column_name='genotypic_test_representative_of_species_at_site_if_disaggregat'
  ) THEN
    ALTER TABLE "genotypicRepresentativeness"
    RENAME COLUMN "genotypic_test_representative_of_species_at_site_if_disaggregat"
    TO "genotypic_repr_species_site_disagg_no_adj";
  END IF;
END $$;
    `);

    // 4. Create exportJob
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exportJob" (
        "id" character varying(256) NOT NULL,
        "owner" character varying,
        "creation" TIMESTAMP NOT NULL DEFAULT now(),
        "updater" character varying,
        "modified" TIMESTAMP NOT NULL DEFAULT now(),
        "requestHash" character varying,
        "filtersJson" jsonb,
        "generateDoi" boolean NOT NULL DEFAULT false,
        "downloaderName" character varying,
        "downloaderEmail" character varying,
        "status" character varying NOT NULL DEFAULT 'queued',
        "progress" integer NOT NULL DEFAULT 0,
        "fileName" character varying,
        "blobPath" text,
        "errorMessage" text,
        "startedAt" TIMESTAMP,
        "completedAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        CONSTRAINT "PK_exportJob" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exportJob_requestHash"
      ON "exportJob" ("requestHash")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_exportJob_status"
      ON "exportJob" ("status")
    `);

    // 5. Add new bioassay column
    await queryRunner.query(`
      ALTER TABLE "insecticideResistanceBioassays"
      ADD COLUMN IF NOT EXISTS "bioassay_repr_complex_site_disagg_no_adj" character varying
    `);

    // 6. Remove old numeric FK columns if they exist
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP COLUMN IF EXISTS "referenceNumId"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP COLUMN IF EXISTS "referenceNumId"
    `);

    // 7. Recreate UUID/string FK only
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD CONSTRAINT "FK_occurrence_reference"
      FOREIGN KEY ("referenceId")
      REFERENCES "reference"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD CONSTRAINT "FK_bionomics_reference"
      FOREIGN KEY ("referenceId")
      REFERENCES "reference"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new FKs
    await queryRunner.query(`
      ALTER TABLE "bionomics"
      DROP CONSTRAINT IF EXISTS "FK_bionomics_reference"
    `);

    await queryRunner.query(`
      ALTER TABLE "occurrence"
      DROP CONSTRAINT IF EXISTS "FK_occurrence_reference"
    `);

    // Restore dropped columns if rollback needed
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD COLUMN IF NOT EXISTS "referenceNumId" integer
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD COLUMN IF NOT EXISTS "referenceNumId" integer
    `);

    // Drop added bioassay column
    await queryRunner.query(`
      ALTER TABLE "insecticideResistanceBioassays"
      DROP COLUMN IF EXISTS "bioassay_repr_complex_site_disagg_no_adj"
    `);

    // Drop exportJob
    await queryRunner.query(`
      DROP TABLE IF EXISTS "exportJob"
    `);

    // Rename column back safely
    await queryRunner.query(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='genotypicRepresentativeness'
      AND column_name='genotypic_repr_species_site_disagg_no_adj'
  ) THEN
    ALTER TABLE "genotypicRepresentativeness"
    RENAME COLUMN "genotypic_repr_species_site_disagg_no_adj"
    TO "genotypic_test_representative_of_species_at_site_if_disaggregat";
  END IF;
END $$;
    `);

    // Restore original FK constraints
    await queryRunner.query(`
      ALTER TABLE "occurrence"
      ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76"
      FOREIGN KEY ("referenceId")
      REFERENCES "reference"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics"
      ADD CONSTRAINT "FK_c16633f8b002bd154c433959095"
      FOREIGN KEY ("referenceId")
      REFERENCES "reference"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);
  }
}