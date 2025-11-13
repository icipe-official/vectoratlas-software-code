import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedIDType21761129088542 implements MigrationInterface {
    name = 'ModifiedIDType21761129088542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "edit_logs" DROP COLUMN "editor"`);
        await queryRunner.query(`ALTER TABLE "edit_logs" ADD "editor" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "edit_logs" DROP COLUMN "editor"`);
        await queryRunner.query(`ALTER TABLE "edit_logs" ADD "editor" character varying NOT NULL`);
    }

}
