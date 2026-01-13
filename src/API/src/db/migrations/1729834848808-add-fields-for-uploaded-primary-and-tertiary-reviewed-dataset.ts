import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsForUploadedPrimaryAndTertiaryReviewedDataset1729834848808 implements MigrationInterface {
  name = 'AddFieldsForUploadedPrimaryAndTertiaryReviewedDataset1729834848808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "uploaded_file_name_primary_reviewed" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "uploaded_file_name_tertiary_reviewed" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."uploaded_dataset_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."uploaded_dataset_status_enum" AS ENUM('Pending', 'Primary Review', 'Pending Tertiary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager', 'Pending Approval', 'Approved')`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "status" "public"."uploaded_dataset_status_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "uploaded_file_name_tertiary_reviewed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "uploaded_file_name_primary_reviewed"`,
    );
  }
}
