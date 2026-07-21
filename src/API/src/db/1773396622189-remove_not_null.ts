import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNotNull1773396622189 implements MigrationInterface {
  name = 'RemoveNotNull1773396622189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.query(
      'ALTER TABLE "insecticideResistanceBioassays" RENAME COLUMN "bioassay_representative_of_complex_at_site_if_disaggregated_val" TO "bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments"',
    );*/
    await queryRunner.query('ALTER TABLE "occurrence" DROP COLUMN "geno_data"');
    await queryRunner.query(
      'ALTER TABLE "genotypicRepresentativeness" ADD "genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "insecticide_resistance_data" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "binary_presence" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "binary_absence" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "larval_data" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "abundance_data" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "pheno_data" DROP NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "pheno_data" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "abundance_data" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "larval_data" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "binary_absence" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "binary_presence" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ALTER COLUMN "insecticide_resistance_data" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "genotypicRepresentativeness" DROP COLUMN "genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments"',
    );
    await queryRunner.query(
      'ALTER TABLE "occurrence" ADD "geno_data" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "insecticideResistanceBioassays" RENAME COLUMN "bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments" TO "bioassay_representative_of_complex_at_site_if_disaggregated_val"',
    );
  }
}
