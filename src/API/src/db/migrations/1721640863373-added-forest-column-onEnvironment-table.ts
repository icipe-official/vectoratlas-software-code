import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedForestColumnOnEnvironmentTable1721640863373 implements MigrationInterface {
    name = 'AddedForestColumnOnEnvironmentTable1721640863373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment" ADD "forest" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "forest"`);
    }

}
