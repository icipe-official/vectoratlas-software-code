import { MigrationInterface, QueryRunner } from "typeorm";

export class MadeNumidNullable1750769839255 implements MigrationInterface {
    name = 'MadeNumidNullable1750769839255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" ADD "num_id" SERIAL`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "UQ_4810e019782e479affcc37578a7" UNIQUE ("num_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "UQ_4810e019782e479affcc37578a7"`);
        await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "num_id"`);
    }

}
