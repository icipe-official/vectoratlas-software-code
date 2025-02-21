import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsvalidatedAndDatasetType1740063563314 implements MigrationInterface {
    name = 'AddIsvalidatedAndDatasetType1740063563314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "dataset_type" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_validated" boolean`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "UQ_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "uploadedDatasetId" character varying`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "UQ_c23192edae196c61acabfd8e610" UNIQUE ("uploadedDatasetId")`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_c23192edae196c61acabfd8e610" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "UQ_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "uploadedDatasetId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "UQ_c23192edae196c61acabfd8e610" UNIQUE ("uploadedDatasetId")`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_c23192edae196c61acabfd8e610" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_validated"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "dataset_type"`);
    }

}
