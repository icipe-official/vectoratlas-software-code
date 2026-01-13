import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCreatorEmailCreatorNameAsMandatory1740394233594 implements MigrationInterface {
  name = 'RemoveCreatorEmailCreatorNameAsMandatory1740394233594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doi" ALTER COLUMN "creator_name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ALTER COLUMN "creator_email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doi" ALTER COLUMN "creator_email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ALTER COLUMN "creator_name" SET NOT NULL`,
    );
  }
}
