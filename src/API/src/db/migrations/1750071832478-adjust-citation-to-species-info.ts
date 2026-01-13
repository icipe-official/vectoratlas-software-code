import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustCitationToSpeciesInfo1750071832478 implements MigrationInterface {
  name = 'AdjustCitationToSpeciesInfo1750071832478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" DROP COLUMN "citations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "species_information" ADD "citations" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" DROP COLUMN "citations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "species_information" ADD "citations" text`,
    );
  }
}
