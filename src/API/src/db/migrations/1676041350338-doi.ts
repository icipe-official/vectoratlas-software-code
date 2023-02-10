import { MigrationInterface, QueryRunner } from "typeorm";

export class doi1676041350338 implements MigrationInterface {
    name = 'doi1676041350338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dataset" ADD "doi" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "doi"`);
    }

}
