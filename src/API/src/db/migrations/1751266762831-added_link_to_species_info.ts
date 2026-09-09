import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLinkToSpeciesInfo1751266762831 implements MigrationInterface {
  name = 'AddedLinkToSpeciesInfo1751266762831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "species_information" ADD "link" character varying`,
    );
    //await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "num_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "num_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "species_information" DROP COLUMN "link"`,
    );
  }
}
