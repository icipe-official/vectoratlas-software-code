import { MigrationInterface, QueryRunner } from "typeorm";

export class UploadDatasetWorkflows1727488576452 implements MigrationInterface {
    name = 'UploadDatasetWorkflows1727488576452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum" AS ENUM('Pending', 'Approved', 'Under Review', 'Rejected', 'Rejected By Reviewer Manager')`);
        await queryRunner.query(`CREATE TABLE "uploaded_dataset" ("id" character varying(256) NOT NULL, "owner" character varying, "creation" TIMESTAMP NOT NULL DEFAULT now(), "updater" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "last_upload_date" TIMESTAMP WITH TIME ZONE NOT NULL, "uploaded_file_name" character varying, "converted_file_name" character varying, "provided_doi" character varying, "status" "public"."uploaded_dataset_status_enum" NOT NULL, "last_status_update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "uploader_email" character varying, "uploader_name" character varying, "assigned_reviewers" character varying, CONSTRAINT "PK_b92fcffb3c065ba8d03842a1d8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doi_approval_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "approval_status" "public"."doi_approval_status_enum" DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "status_updated_on" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "status_updated_by" character varying`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "PK_56a00f721a8979e01b4bc0e2068"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "id" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "PK_56a00f721a8979e01b4bc0e2068" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "creation"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "creation" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "modified"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "modified" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "modified"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "modified" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "creation"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "creation" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "PK_56a00f721a8979e01b4bc0e2068"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "PK_56a00f721a8979e01b4bc0e2068" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "status_updated_by"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "status_updated_on"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "approval_status"`);
        await queryRunner.query(`DROP TYPE "public"."doi_approval_status_enum"`);
        await queryRunner.query(`DROP TABLE "uploaded_dataset"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum"`);
    }

}
