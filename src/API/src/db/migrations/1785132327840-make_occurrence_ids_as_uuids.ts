import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOccurrenceIdsAsUuids1785132327840
  implements MigrationInterface
{
  name = 'MakeOccurrenceIdsAsUuids1785132327840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exportJob" DROP COLUMN "occurrence_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exportJob" ADD "occurrence_ids" uuid array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exportJob" DROP COLUMN "occurrence_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exportJob" ADD "occurrence_ids" character varying array DEFAULT '{}'`,
    );
  }
}
