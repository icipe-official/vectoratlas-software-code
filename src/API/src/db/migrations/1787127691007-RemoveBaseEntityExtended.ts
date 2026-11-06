import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveBaseEntityExtended1787127691007
  implements MigrationInterface
{
  name = 'RemoveBaseEntityExtended1787127691007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop base entity columns from email_registry
    await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN IF EXISTS "owner"`);
    await queryRunner.query(
      `ALTER TABLE "email_registry" DROP COLUMN IF EXISTS "creation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_registry" DROP COLUMN IF EXISTS "updater"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_registry" DROP COLUMN IF EXISTS "modified"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore base entity columns to email_registry
    await queryRunner.query(
      `ALTER TABLE "email_registry" ADD "modified" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_registry" ADD "updater" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_registry" ADD "creation" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_registry" ADD "owner" character varying`,
    );
  }
}
