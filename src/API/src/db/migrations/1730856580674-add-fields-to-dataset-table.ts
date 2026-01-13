import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsToDatasetTable1730856580674 implements MigrationInterface {
  name = 'AddFieldsToDatasetTable1730856580674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "dataType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "dataSource" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "dataset" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "location" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "region" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "fileName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "fileSize" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "dataset" ADD "fileType" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "fileType"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "fileSize"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "fileName"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "region"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "dataSource"`);
    await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "dataType"`);
  }
}
