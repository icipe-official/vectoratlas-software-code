import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsModelManagerToUserRole1745397211787 implements MigrationInterface {
  name = 'AddIsModelManagerToUserRole1745397211787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD "is_model_manager" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP COLUMN "is_model_manager"`,
    );
  }
}
