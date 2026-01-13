import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUploadedModelSchema1745548891691 implements MigrationInterface {
  name = 'UpdateUploadedModelSchema1745548891691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "model" DROP COLUMN "comments"`);
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "source_country" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "source_region" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "source_region" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "source_country" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "model" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "model" ADD "comments" character varying`,
    );
  }
}
