import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRainfallTime1721218411591 implements MigrationInterface {
    name = 'AddedRainfallTime1721218411591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "rainfall_time" character varying`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "ir_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "ir_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "title" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "ir_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "ir_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "rainfall_time"`);
    }

}
