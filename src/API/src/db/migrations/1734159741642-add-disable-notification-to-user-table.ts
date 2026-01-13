import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisableNotificationToUserTable1734159741642 implements MigrationInterface {
  name = 'AddDisableNotificationToUserTable1734159741642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD "disable_notification" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP COLUMN "disable_notification"`,
    );
  }
}
