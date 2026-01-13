import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaxValueAndCommentsToUploadedModel1745495410777 implements MigrationInterface {
  name = 'AddMaxValueAndCommentsToUploadedModel1745495410777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "model" ADD "maxValue" integer`);
    await queryRunner.query(
      `ALTER TABLE "model" ADD "comments" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "model" DROP COLUMN "comments"`);
    await queryRunner.query(`ALTER TABLE "model" DROP COLUMN "maxValue"`);
  }
}
