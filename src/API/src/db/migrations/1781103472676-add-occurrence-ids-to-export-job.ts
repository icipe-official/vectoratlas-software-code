import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOccurrenceIdsToExportJob1781103472676
  implements MigrationInterface
{
  name = 'AddOccurrenceIdsToExportJob1781103472676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exportJob" ADD "occurrence_ids" character varying array DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exportJob" DROP COLUMN "occurrence_ids"`,
    );
  }
}
