import { MigrationInterface, QueryRunner } from "typeorm";

export class newsLastUpdated1670412358270 implements MigrationInterface {
    name = 'newsLastUpdated1670412358270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" ADD "lastUpdated" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "summary" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "news" ADD "summary" character varying(1024) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "lastUpdated"`);
    }

}
