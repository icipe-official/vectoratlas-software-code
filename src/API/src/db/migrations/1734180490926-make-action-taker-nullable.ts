import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeActionTakerNullable1734180490926 implements MigrationInterface {
  name = 'MakeActionTakerNullable1734180490926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" ALTER COLUMN "action_taker" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" ALTER COLUMN "action_taker" SET NOT NULL`,
    );
  }
}
