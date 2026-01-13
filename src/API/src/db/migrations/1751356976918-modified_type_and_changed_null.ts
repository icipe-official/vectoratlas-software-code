import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedTypeAndChangedNull1751356976918 implements MigrationInterface {
  name = 'ModifiedTypeAndChangedNull1751356976918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ❌ Wrong:
    // await queryRunner.query(`DROP INDEX "public"."UQ_4810e019782e479affcc37578a7"`);

    // ✅ Correct:
    await queryRunner.query(`
      ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"
    `);

    // Then add a new one if needed (or skip this if you don't need it)
    await queryRunner.query(`
      ALTER TABLE "reference" ADD CONSTRAINT "UQ_4810e019782e479affcc37578a7" UNIQUE ("num_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_4810e019782e479affcc37578a7" ON "reference" ("num_id")
    `);
  }
}
