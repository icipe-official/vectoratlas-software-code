import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNotNull21773396686949 implements MigrationInterface {
    name = 'RemoveNotNull21773396686949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'insecticideResistanceBioassays'
      AND column_name = 'bioassay_representative_of_complex_at_site_if_disaggregated_val'
    ) THEN
      ALTER TABLE "insecticideResistanceBioassays" 
      DROP COLUMN "bioassay_representative_of_complex_at_site_if_disaggregated_val";
    END IF;
  END $$;
`);
        await queryRunner.query(`
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'genotypicRepresentativeness'
      AND column_name = 'genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments'
    ) THEN
      ALTER TABLE "genotypicRepresentativeness" 
      ADD "genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments" character varying;
    END IF;
  END $$;
`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "insecticide_resistance_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "binary_presence" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "binary_absence" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "larval_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "abundance_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "pheno_data" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "pheno_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "abundance_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "larval_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "binary_absence" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "binary_presence" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "insecticide_resistance_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "genotypicRepresentativeness" DROP COLUMN "genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" RENAME COLUMN "bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments" TO "bioassay_representative_of_complex_at_site_if_disaggregated_val"`);
    }

}
