import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrenceSite1662378543384 implements MigrationInterface {
    name = 'occurrenceSite1662378543384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "area_type"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "area_type" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "area_type"`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "area_type" character varying(50)`);
    }

}
