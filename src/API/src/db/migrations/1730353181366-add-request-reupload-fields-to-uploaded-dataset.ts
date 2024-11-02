import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRequestReuploadFieldsToUploadedDataset1730353181366 implements MigrationInterface {
    name = 'AddRequestReuploadFieldsToUploadedDataset1730353181366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_reupload_requested" boolean`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "reupload_requested_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "reupload_request_comment" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_reuploaded" boolean`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "reupload_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD "doiRefId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD CONSTRAINT "UQ_d601e1a695614e8ced4cd52c196" UNIQUE ("doiRefId")`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD "uploadedDatasetId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD CONSTRAINT "UQ_05210c70ad716c2b8c5fbf7a9ce" UNIQUE ("uploadedDatasetId")`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD CONSTRAINT "FK_d601e1a695614e8ced4cd52c196" FOREIGN KEY ("doiRefId") REFERENCES "doi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD CONSTRAINT "FK_05210c70ad716c2b8c5fbf7a9ce" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dataset" DROP CONSTRAINT "FK_05210c70ad716c2b8c5fbf7a9ce"`);
        await queryRunner.query(`ALTER TABLE "dataset" DROP CONSTRAINT "FK_d601e1a695614e8ced4cd52c196"`);
        await queryRunner.query(`ALTER TABLE "dataset" DROP CONSTRAINT "UQ_05210c70ad716c2b8c5fbf7a9ce"`);
        await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "dataset" DROP CONSTRAINT "UQ_d601e1a695614e8ced4cd52c196"`);
        await queryRunner.query(`ALTER TABLE "dataset" DROP COLUMN "doiRefId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "reupload_date"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_reuploaded"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "reupload_request_comment"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "reupload_requested_date"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_reupload_requested"`);
    }

}
