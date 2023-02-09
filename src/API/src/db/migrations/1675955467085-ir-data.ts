import { MigrationInterface, QueryRunner } from "typeorm";

export class irData1675955467085 implements MigrationInterface {
    name = 'irData1675955467085'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "occurrence" ADD "ir_data" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "ir_data" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "ir_data"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "ir_data"`);
    }

}
