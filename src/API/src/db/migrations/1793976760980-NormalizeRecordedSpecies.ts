import { MigrationInterface, QueryRunner } from 'typeorm';
import { RECORDED_SPECIES_DATA } from '../species/species.data';

/**
 * Normalizes recorded_species into a country-style split:
 *
 *   species(id PK = name, name UNIQUE, display_name, category, color,
 *           alternative_names[], audit cols)            -- reference table (like country)
 *   recorded_species(id PK, species FK -> species.id, species_id_1,
 *                    species_id_2, species_notes,          -- "species" keeps its name, now the FK
 *                    UNIQUE(species, species_id_1, species_id_2, species_notes)
 *                    NULLS NOT DISTINCT)
 *
 * The only change to recorded_species is dropping the denormalized
 * display_name/category/color columns; `species` stays but now references
 * species.id (which equals the species name, like country.id = name).
 *
 * Existing migrations are untouched; this is a new migration.
 */
export class NormalizeRecordedSpecies1793976760980 implements MigrationInterface {
  name = 'NormalizeRecordedSpecies1793976760980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the species reference table (mirrors `country`)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "species" (
        "id" varchar(256) NOT NULL PRIMARY KEY,
        "name" varchar NOT NULL UNIQUE,
        "display_name" varchar,
        "category" varchar,
        "color" varchar,
        "alternative_names" varchar[] NOT NULL DEFAULT '{}',
        "owner" varchar,
        "creation" timestamp NOT NULL DEFAULT now(),
        "updater" varchar,
        "modified" timestamp NOT NULL DEFAULT now()
      )
    `);

    // 2. Seed from the curated species data (id = species key, like country's id = name)
    for (const item of RECORDED_SPECIES_DATA) {
      await queryRunner.query(
        `INSERT INTO "species" ("id", "name", "display_name", "category", "color")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("name") DO NOTHING`,
        [item.species, item.species, item.display_name, item.category, item.color],
      );
    }

    // 2b. Merge any species already present in recorded_species but missing from the seed
    await queryRunner.query(`
      INSERT INTO "species" ("id", "name", "display_name")
      SELECT DISTINCT ON (lower(trim("species"))) lower(trim("species")), lower(trim("species")), "species"
      FROM "recorded_species"
      WHERE "species" IS NOT NULL AND trim("species") <> ''
      ON CONFLICT ("name") DO NOTHING
    `);

    // 3. Move the old raw text column aside, then re-create "species" as the FK column
    await queryRunner.query(
      `ALTER TABLE "recorded_species" RENAME COLUMN "species" TO "species_legacy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species" ADD COLUMN "species" varchar(256)`,
    );
    await queryRunner.query(`
      UPDATE "recorded_species" rs
      SET "species" = s."id"
      FROM "species" s
      WHERE lower(trim(rs."species_legacy")) = lower(trim(s."name"))
    `);
    // Any leftovers (empty/null legacy value) get a synthetic entry so the column can be NOT NULL
    await queryRunner.query(`
      INSERT INTO "species" ("id", "name", "display_name")
      SELECT 'unknown', 'unknown', 'unknown'
      WHERE NOT EXISTS (SELECT 1 FROM "species" WHERE "name" = 'unknown')
      ON CONFLICT ("name") DO NOTHING
    `);
    await queryRunner.query(
      `UPDATE "recorded_species" SET "species" = 'unknown' WHERE "species" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "recorded_species" ALTER COLUMN "species" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "recorded_species"
      ADD CONSTRAINT "FK_recorded_species_species"
      FOREIGN KEY ("species") REFERENCES "species"("id")
    `);

    // 4. One recorded_species row per distinct (species, id methods, notes) combination
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_recorded_species_composite"
      ON "recorded_species" ("species", "species_id_1", "species_id_2", "species_notes")
      NULLS NOT DISTINCT
    `);

    // 5. Drop the legacy raw text column and the denormalized feature columns
    await queryRunner.query(`
      ALTER TABLE "recorded_species"
       DROP COLUMN IF EXISTS "species_legacy",
       DROP COLUMN IF EXISTS "display_name",
       DROP COLUMN IF EXISTS "category",
       DROP COLUMN IF EXISTS "color"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recorded_species" RENAME COLUMN "species" TO "species_fk"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species"
       ADD COLUMN IF NOT EXISTS "species" varchar,
       ADD COLUMN IF NOT EXISTS "display_name" varchar,
       ADD COLUMN IF NOT EXISTS "category" varchar,
       ADD COLUMN IF NOT EXISTS "color" varchar`,
    );
    await queryRunner.query(`
      UPDATE "recorded_species" rs
      SET "species" = s."name", "display_name" = s."display_name",
          "category" = s."category", "color" = s."color"
      FROM "species" s WHERE rs."species_fk" = s."id"
    `);
    await queryRunner.query(
      `ALTER TABLE "recorded_species" DROP CONSTRAINT IF EXISTS "FK_recorded_species_species"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_recorded_species_composite"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "species_fk"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "species"`);
  }
}
