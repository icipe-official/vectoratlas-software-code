import { MigrationInterface, QueryRunner } from "typeorm";

export class timestamps1666878164823 implements MigrationInterface {
    name = 'timestamps1666878164823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "timestamp_start" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "timestamp_end" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "timestamp_start" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "timestamp_end" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "timestamp_end"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "timestamp_start"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "timestamp_end"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "timestamp_start"`);
    }

}
