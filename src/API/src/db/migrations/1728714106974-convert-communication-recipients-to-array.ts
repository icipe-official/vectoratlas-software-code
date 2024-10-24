import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertCommunicationRecipientsToArray1728714106974 implements MigrationInterface {
    name = 'ConvertCommunicationRecipientsToArray1728714106974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "recipients"`);
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "recipients" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "recipients"`);
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "recipients" character varying NOT NULL`);
    }

}
