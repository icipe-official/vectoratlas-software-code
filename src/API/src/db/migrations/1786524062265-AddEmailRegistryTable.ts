import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailRegistryTable1786524062265 implements MigrationInterface {
    name = 'AddEmailRegistryTable1786524062265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_registry" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "verification_code" text, "code_expires_at" TIMESTAMP WITH TIME ZONE, "is_news_notification_enabled" boolean NOT NULL DEFAULT false, "news_last_modified_at" TIMESTAMP WITH TIME ZONE, "is_new_dataset_notification_enabled" boolean NOT NULL DEFAULT false, "new_dataset_last_modified_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_6540af955da99fd53fde5f5566a" UNIQUE ("email"), CONSTRAINT "PK_3cf4bce5f7962aeab607e6a86a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_registry"`);
    }

}
