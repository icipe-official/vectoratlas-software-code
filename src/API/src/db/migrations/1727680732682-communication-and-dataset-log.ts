import { MigrationInterface, QueryRunner } from "typeorm";

export class CommunicationAndDatasetLog1727680732682 implements MigrationInterface {
    name = 'CommunicationAndDatasetLog1727680732682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_log_action_type_enum" AS ENUM('New Dataset Upload', 'Update Dataset Details', 'Dataset Re-Upload', 'Communication', 'Approve Dataset', 'Reject Raw Dataset', 'Reject Reviewed Data', 'Generate DOI')`);
        await queryRunner.query(`CREATE TABLE "uploaded_dataset_log" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "action_type" "public"."uploaded_dataset_log_action_type_enum" NOT NULL, "action_date" date NOT NULL, "action_details" text NOT NULL, "action_taker" text NOT NULL, "datasetId" character varying(256), CONSTRAINT "PK_1268e168f774ff43d0b000c1b9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doi_source_source_type_enum" AS ENUM('Download', 'Upload')`);
        await queryRunner.query(`CREATE TYPE "public"."doi_source_approval_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "doi_source" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "source_type" "public"."doi_source_source_type_enum" NOT NULL, "download_meta_data" json NOT NULL, "approval_status" "public"."doi_source_approval_status_enum" DEFAULT 'Pending', "title" character varying NOT NULL, "author_name" character varying NOT NULL, "author_email" character varying NOT NULL, CONSTRAINT "PK_5e5a3125bbbcc54130f200507e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."communication_log_channel_type_enum" AS ENUM('Email')`);
        await queryRunner.query(`CREATE TYPE "public"."communication_log_sent_status_enum" AS ENUM('Pending', 'Sent', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "communication_log" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "communication_date" TIMESTAMP NOT NULL DEFAULT now(), "channel_type" "public"."communication_log_channel_type_enum" DEFAULT 'Email', "recipients" character varying NOT NULL, "message_type" character varying NOT NULL, "message" character varying NOT NULL, "sent_status" "public"."communication_log_sent_status_enum" DEFAULT 'Pending', "sent_date" TIMESTAMP WITH TIME ZONE, "sent_response" character varying, "reference_entity_type" character varying, "reference_entity_name" character varying, "error_description" character varying, "arguments" character varying, CONSTRAINT "PK_9c870c124b618286693be17acd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613" FOREIGN KEY ("datasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613"`);
        await queryRunner.query(`DROP TABLE "communication_log"`);
        await queryRunner.query(`DROP TYPE "public"."communication_log_sent_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."communication_log_channel_type_enum"`);
        await queryRunner.query(`DROP TABLE "doi_source"`);
        await queryRunner.query(`DROP TYPE "public"."doi_source_approval_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."doi_source_source_type_enum"`);
        await queryRunner.query(`DROP TABLE "uploaded_dataset_log"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_log_action_type_enum"`);
    }

}
