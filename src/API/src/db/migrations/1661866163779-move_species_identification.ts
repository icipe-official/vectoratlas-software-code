import { MigrationInterface, QueryRunner } from "typeorm";

export class moveSpeciesIdentification1661866163779 implements MigrationInterface {
    name = 'moveSpeciesIdentification1661866163779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "id_1"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "id_2"`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_1" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "species" ADD "id_2" character varying(250)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_2"`);
        await queryRunner.query(`ALTER TABLE "species" DROP COLUMN "id_1"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "id_2" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "id_1" character varying(250)`);
    }

}
