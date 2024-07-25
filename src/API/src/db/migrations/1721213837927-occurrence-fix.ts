import { MigrationInterface, QueryRunner } from "typeorm";

export class OccurrenceFix1721213837927 implements MigrationInterface {
    name = 'OccurrenceFix1721213837927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "binary_presence" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "abundance_data" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "ir_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "ir_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "title" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "ir_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "ir_data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "abundance_data"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "binary_presence"`);
    }

}
