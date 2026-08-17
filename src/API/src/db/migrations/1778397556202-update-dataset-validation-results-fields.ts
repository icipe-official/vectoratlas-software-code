import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatasetValidationResultsFields1778397556202
  implements MigrationInterface
{
  name = 'UpdateDatasetValidationResultsFields1778397556202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "is_full_dataset_validation" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "total_rows" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "validation_start_row" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "validation_end_row" integer DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "invalid_rows" integer array DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "validation_errors" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "validation_errors"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "invalid_rows"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "validation_end_row"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "validation_start_row"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "total_rows"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "is_full_dataset_validation"`,
    );
  }
}
