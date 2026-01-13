import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthorFieldToUploadedDataset1741614584712 implements MigrationInterface {
  name = 'AddAuthorFieldToUploadedDataset1741614584712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" ADD "author" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset" DROP COLUMN "author"`,
    );
  }
}
