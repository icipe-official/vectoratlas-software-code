import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUpdatedDatasetLogActionDateCreateDateColumn1730771947552 implements MigrationInterface {
  name = 'MakeUpdatedDatasetLogActionDateCreateDateColumn1730771947552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" DROP COLUMN "action_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" ADD "action_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" DROP COLUMN "action_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploaded_dataset_log" ADD "action_date" date NOT NULL`,
    );
  }
}
