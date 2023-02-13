import { MigrationInterface, QueryRunner } from "typeorm";

export class approveInitialData1674483594097 implements MigrationInterface {
    name = 'approveInitialData1674483594097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "dataset" SET "status" = 'Approved' WHERE "id" = 'initial-id'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "dataset" SET "status" = '' WHERE "id" = 'initial-id'`);
    }

}
