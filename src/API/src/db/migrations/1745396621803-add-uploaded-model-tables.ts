import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUploadedModelTables1745396621803 implements MigrationInterface {
  name = 'AddUploadedModelTables1745396621803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "model" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "last_upload_date" TIMESTAMP WITH TIME ZONE NOT NULL, "uploaded_file_name" character varying, "is_reupload_requested" boolean, "reupload_requested_date" TIMESTAMP, "reupload_request_comment" character varying, "is_reuploaded" boolean, "reupload_date" TIMESTAMP, "reupload_comment" character varying, "provided_doi" character varying, "status" character varying, "last_status_update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "uploader" character varying, "uploader_email" character varying, "uploader_name" character varying, "reviewers" character varying array DEFAULT '{}', "approved_by" character varying array DEFAULT '{}', "approved_on" TIMESTAMP WITH TIME ZONE, "source_country" character varying NOT NULL, "source_region" character varying NOT NULL, "is_doi_requested" boolean, "affiliated_institution" character varying, "author" character varying, CONSTRAINT "PK_d6df271bba301d5cc79462912a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "model_log" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "action_type" text NOT NULL, "action_date" TIMESTAMP NOT NULL DEFAULT now(), "action_details" text NOT NULL, "action_taker" text, "uploadedModelId" character varying(256), CONSTRAINT "PK_5530f6e8c321b4d68a91c69bcaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ADD "uploaded_model" character varying(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ADD CONSTRAINT "UQ_15430e6df4f041655e2b4ee026d" UNIQUE ("uploaded_model")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" ADD CONSTRAINT "FK_15430e6df4f041655e2b4ee026d" FOREIGN KEY ("uploaded_model") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "model_log" ADD CONSTRAINT "FK_ea4d89527c32030ad6be41cc8e7" FOREIGN KEY ("uploadedModelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "model_log" DROP CONSTRAINT "FK_ea4d89527c32030ad6be41cc8e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" DROP CONSTRAINT "FK_15430e6df4f041655e2b4ee026d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doi" DROP CONSTRAINT "UQ_15430e6df4f041655e2b4ee026d"`,
    );
    await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "uploaded_model"`);
    await queryRunner.query(`DROP TABLE "model_log"`);
    await queryRunner.query(`DROP TABLE "model"`);
  }
}
