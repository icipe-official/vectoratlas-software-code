import { MigrationInterface, QueryRunner } from "typeorm";

export class environmentUpdate1675849556721 implements MigrationInterface {
    name = 'environmentUpdate1675849556721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "outdoor_activities_night"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "outdoor_activities_night" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment" DROP COLUMN "outdoor_activities_night"`);
        await queryRunner.query(`ALTER TABLE "environment" ADD "outdoor_activities_night" boolean`);
    }

}
