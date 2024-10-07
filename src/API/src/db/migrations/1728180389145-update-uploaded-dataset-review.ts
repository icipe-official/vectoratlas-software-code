import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUploadedDatasetReview1728180389145 implements MigrationInterface {
    name = 'UpdateUploadedDatasetReview1728180389145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "assigned_reviewers"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "primary_reviewers" character varying array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "tertiary_reviewers" character varying array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "approved_by" character varying array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "approved_on" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_va_data" boolean`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "va_data_abstracted_by" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "va_data_checked_by" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "va_final_checked_by" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum" RENAME TO "uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum" AS ENUM('Pending', 'Approved', 'Primary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum" USING "status"::"text"::"public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum_old" AS ENUM('Pending', 'Approved', 'Under Review', 'Rejected', 'Rejected By Reviewer Manager')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum_old" USING "status"::"text"::"public"."uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum_old" RENAME TO "uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "va_final_checked_by"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "va_data_checked_by"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "va_data_abstracted_by"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_va_data"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "approved_on"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "approved_by"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "tertiary_reviewers"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "primary_reviewers"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "assigned_reviewers" character varying`);
    }

}
