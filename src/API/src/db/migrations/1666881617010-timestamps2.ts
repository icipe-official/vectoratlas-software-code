import { MigrationInterface, QueryRunner } from "typeorm";

export class timestamps21666881617010 implements MigrationInterface {
    name = 'timestamps21666881617010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "timestamp_start" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "timestamp_end" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "timestamp_start" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "timestamp_end" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "timestamp_end"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "timestamp_start"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "timestamp_end"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "timestamp_start"`);
    }

}
