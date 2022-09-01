import { MigrationInterface, QueryRunner } from "typeorm";

export class speciesId1662017606646 implements MigrationInterface {
    name = 'speciesId1662017606646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_1"`);
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_2"`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_method_1" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_method_2" character varying(250)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_method_2"`);
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_method_1"`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_2" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_1" character varying(250)`);
    }

}
