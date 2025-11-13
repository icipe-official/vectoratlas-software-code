import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEditLogsTable1761047019614 implements MigrationInterface {
    name = 'CreateEditLogsTable1761047019614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "edit_logs" ("id" SERIAL NOT NULL, "occurrenceId" integer NOT NULL, "initialData" jsonb, "modifiedData" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "editor" character varying NOT NULL, "reasonForEdit" character varying, CONSTRAINT "PK_c769f88150aed540c8beb4db73f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "edit_logs"`);
    }

}
