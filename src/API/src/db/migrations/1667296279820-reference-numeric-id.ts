import { MigrationInterface, QueryRunner } from "typeorm";

export class referenceNumericId1667296279820 implements MigrationInterface {
    name = 'referenceNumericId1667296279820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reference" ADD "num_id" integer`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "reference_id_seq" INCREMENT 1 START 1 MINVALUE 1 OWNED BY "reference"."num_id"`);
        await queryRunner.query(`UPDATE "reference" SET "num_id"=nextval('reference_id_seq')`);
        await queryRunner.query(`ALTER TABLE "reference" ALTER COLUMN "num_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`ALTER TABLE "reference" DROP COLUMN "num_id"`);
    }

}
