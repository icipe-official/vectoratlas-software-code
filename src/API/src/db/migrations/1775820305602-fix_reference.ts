import { MigrationInterface, QueryRunner } from "typeorm";

export class FixReference1775820305602 implements MigrationInterface {
  name = 'FixReference1775820305602'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. DROP DEPENDENT FOREIGN KEYS FIRST
    // We must remove these before we can touch the Primary Key of the table they point to.
    await queryRunner.query(`
      ALTER TABLE "occurrence" DROP CONSTRAINT IF EXISTS "FK_69457bf7344e306225f91c5bb76"
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics" DROP CONSTRAINT IF EXISTS "FK_c16633f8b002bd154c433959095"
    `);

    // 2. CLEAN UP SEQUENCES
    // Resolves the "more than one owned sequence found" error.
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS "reference_id_seq" OWNED BY NONE
    `);

    await queryRunner.query(`
      DROP SEQUENCE IF EXISTS "reference_id_seq"
    `);

    // 3. DROP OLD PRIMARY KEY AND ESTABLISH NEW ONE
    // We drop the constraint that was causing conflicts and explicitly set "id" as the PK.
    await queryRunner.query(`
      ALTER TABLE "reference" DROP CONSTRAINT IF EXISTS "PK_01bacbbdd90839b7dce352e4250"
    `);

    await queryRunner.query(`
      ALTER TABLE "reference" ADD PRIMARY KEY ("id")
    `);

    // 4. SAFE COLUMN RENAME (genotypicRepresentativeness)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='genotypicRepresentativeness' 
          AND column_name='genotypic_test_representative_of_species_at_site_if_disaggregat'
        ) THEN
          ALTER TABLE "genotypicRepresentativeness" 
          RENAME COLUMN "genotypic_test_representative_of_species_at_site_if_disaggregat" 
          TO "genotypic_repr_species_site_disagg_no_adj";
        END IF;
      END $$;
    `);

    // 5. CREATE EXPORTJOB TABLE
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

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_exportJob_requestHash" ON "exportJob" ("requestHash")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_exportJob_status" ON "exportJob" ("status")`);

    // 6. ADD NEW BIOASSAY COLUMN & CLEANUP OLD NUMERIC COLUMNS
    await queryRunner.query(`
      ALTER TABLE "insecticideResistanceBioassays" 
      ADD COLUMN IF NOT EXISTS "bioassay_repr_complex_site_disagg_no_adj" character varying
    `);

    await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN IF EXISTS "referenceNumId"`);
    await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN IF EXISTS "referenceNumId"`);

    // 7. RECREATE FOREIGN KEYS
    // Now that reference("id") is a valid Primary Key, these constraints will succeed.
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
    // Drop the new FKs
    await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT IF EXISTS "FK_bionomics_reference"`);
    await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT IF EXISTS "FK_occurrence_reference"`);

    // Revert Column changes
    await queryRunner.query(`ALTER TABLE "occurrence" ADD COLUMN IF NOT EXISTS "referenceNumId" integer`);
    await queryRunner.query(`ALTER TABLE "bionomics" ADD COLUMN IF NOT EXISTS "referenceNumId" integer`);

    // Drop ExportJob
    await queryRunner.query(`DROP TABLE IF EXISTS "exportJob"`);

    // Restore original FK constraints
    await queryRunner.query(`
      ALTER TABLE "occurrence" 
      ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" 
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "bionomics" 
      ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" 
      FOREIGN KEY ("referenceId") REFERENCES "reference"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}