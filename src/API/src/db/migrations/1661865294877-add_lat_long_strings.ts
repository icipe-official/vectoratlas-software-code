import { MigrationInterface, QueryRunner } from "typeorm";

export class addLatLongStrings1661865294877 implements MigrationInterface {
    name = 'addLatLongStrings1661865294877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ADD "latitude_2" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "site" ADD "longitude_2" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude_2"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude_2"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "latitude"`);
    }

}
