import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAdminLev1722931988901 implements MigrationInterface {
    name = 'FixAdminLev1722931988901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_level_1"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_level_1" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "admin_level_1"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "admin_level_1" integer`);
    }

}
