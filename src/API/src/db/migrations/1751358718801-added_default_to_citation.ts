import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDefaultToCitation1751358718801 implements MigrationInterface {
  name = 'AddedDefaultToCitation1751358718801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" ALTER COLUMN "citations" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" ALTER COLUMN "citations" DROP DEFAULT`,
    );
  }
}
