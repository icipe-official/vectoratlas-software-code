import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdultDataColumnToOccurrence1781690042160 implements MigrationInterface {
  name = 'AddAdultDataColumnToOccurrence1781690042160'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "occurrence" ADD IF NOT EXISTS "adult_data" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "adult_data"`);
  }
}
