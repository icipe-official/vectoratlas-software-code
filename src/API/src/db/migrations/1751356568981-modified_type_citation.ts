import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedTypeCitation1751356568981 implements MigrationInterface {
  name = 'ModifiedTypeCitation1751356568981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_4810e019782e479affcc37578a7"`,
    );
    //await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "num_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "reference" ADD CONSTRAINT "UQ_4810e019782e479affcc37578a7" UNIQUE ("num_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"`,
    );
    //await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "num_id" SET NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_4810e019782e479affcc37578a7" ON "reference" ("num_id") `,
    );
  }
}
