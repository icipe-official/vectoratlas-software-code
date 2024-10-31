import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadedDatasetIdToDoiTable1730295585069 implements MigrationInterface {
    name = 'AddUploadedDatasetIdToDoiTable1730295585069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" RENAME COLUMN "datasetId" TO "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "is_reviewerManager"`);
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "subject" character varying`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "comments" character varying`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "uploadedDatasetId" character varying`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "UQ_c23192edae196c61acabfd8e610" UNIQUE ("uploadedDatasetId")`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum" RENAME TO "uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum" AS ENUM('Pending', 'Primary Review', 'Pending Tertiary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager', 'Pending Approval', 'Approved')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum" USING "status"::"text"::"public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "recipients"`);
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "recipients" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD CONSTRAINT "FK_18e573b5e29a8fb1c30baf6a826" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_c23192edae196c61acabfd8e610" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP CONSTRAINT "FK_18e573b5e29a8fb1c30baf6a826"`);
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "recipients"`);
        await queryRunner.query(`ALTER TABLE "communication_log" ADD "recipients" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."uploaded_dataset_status_enum_old" AS ENUM('Pending', 'Approved', 'Primary Review', 'Tertiary Review', 'Rejected', 'Rejected By Reviewer Manager')`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ALTER COLUMN "status" TYPE "public"."uploaded_dataset_status_enum_old" USING "status"::"text"::"public"."uploaded_dataset_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."uploaded_dataset_status_enum_old" RENAME TO "uploaded_dataset_status_enum"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "UQ_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "communication_log" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "is_reviewerManager" boolean`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" RENAME COLUMN "uploadedDatasetId" TO "datasetId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613" FOREIGN KEY ("datasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
