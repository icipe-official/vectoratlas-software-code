import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryEntityAndSpeciesDisplayName1783428715373
  implements MigrationInterface
{
  name = 'AddCountryEntityAndSpeciesDisplayName1783428715373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "country" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "iso_code_2" character varying(2), "iso_code_3" character varying(3), "alternative_names" character varying array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"), CONSTRAINT "UQ_be90448006d716041b2c1abd4ae" UNIQUE ("iso_code_2"), CONSTRAINT "UQ_2107c75ccd11a84dbbbcd504b1c" UNIQUE ("iso_code_3"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "display_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "category" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD COLUMN IF NOT EXISTS "country_id" character varying(256)`,
    );
    
    // Fixed: Wrapped constraint addition in a Postgres code block to safely simulate "IF NOT EXISTS"
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_6d80331403939350918a8ddc3d3') THEN
          ALTER TABLE "site" 
          ADD CONSTRAINT "FK_6d80331403939350918a8ddc3d3" 
          FOREIGN KEY ("country_id") 
          REFERENCES "country"("id") 
          ON DELETE NO ACTION 
          ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT IF EXISTS "FK_6d80331403939350918a8ddc3d3"`,
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN IF EXISTS "country_id"`);
    await queryRunner.query(
      `ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "display_name"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "country"`);
  }
}