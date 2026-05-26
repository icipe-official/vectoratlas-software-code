import { MigrationInterface, QueryRunner } from "typeorm";

export class Shortenlongnames1775340032296 implements MigrationInterface {
    name = 'Shortenlongnames1775340032296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          DO $$
          BEGIN
            IF EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'genotypicRepresentativeness'
                AND column_name = 'genotypic_test_representative_of_species_at_site_if_disaggregat'
            ) THEN
              ALTER TABLE "genotypicRepresentativeness"
              RENAME COLUMN "genotypic_test_representative_of_species_at_site_if_disaggregat"
              TO "genotypic_repr_species_site_disagg_no_adj";
            END IF;
          END $$;
        `);

        await queryRunner.query(`
          ALTER TABLE "insecticideResistanceBioassays"
          ADD COLUMN IF NOT EXISTS "bioassay_repr_complex_site_disagg_no_adj" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "insecticideResistanceBioassays"
          DROP COLUMN IF EXISTS "bioassay_repr_complex_site_disagg_no_adj"
        `);

        await queryRunner.query(`
          DO $$
          BEGIN
            IF EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'genotypicRepresentativeness'
                AND column_name = 'genotypic_repr_species_site_disagg_no_adj'
            ) THEN
              ALTER TABLE "genotypicRepresentativeness"
              RENAME COLUMN "genotypic_repr_species_site_disagg_no_adj"
              TO "genotypic_test_representative_of_species_at_site_if_disaggregat";
            END IF;
          END $$;
        `);
    }
}
