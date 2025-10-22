import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedIDType1761128229976 implements MigrationInterface {
    name = 'ModifiedIDType1761128229976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "edit_logs" DROP COLUMN "occurrenceId"`);
        await queryRunner.query(`ALTER TABLE "edit_logs" ADD "occurrenceId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "edit_logs" DROP COLUMN "occurrenceId"`);
        await queryRunner.query(`ALTER TABLE "edit_logs" ADD "occurrenceId" integer NOT NULL`);
    }

}
