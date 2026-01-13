import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingTemplateFieldsToOccurrenceEntity1756343417980 implements MigrationInterface {
  name = 'AddMissingTemplateFieldsToOccurrenceEntity1756343417980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occurrence" ADD "confidentiality_status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "occurrence" ADD "source_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "occurrence" ADD "bio_data" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "occurrence" ADD "personal_communication" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "occurrence" ADD "source_notes" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occurrence" DROP COLUMN "source_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "occurrence" DROP COLUMN "personal_communication"`,
    );
    await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "bio_data"`);
    await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "source_id"`);
    await queryRunner.query(
      `ALTER TABLE "occurrence" DROP COLUMN "confidentiality_status"`,
    );
  }
}
