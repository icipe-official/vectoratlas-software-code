import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDoiDatasetField1729467153267 implements MigrationInterface {
    name = 'RenameDoiDatasetField1729467153267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_eeddceee9c21ea9b0bf90adaa60"`);
        await queryRunner.query(`ALTER TABLE "doi" RENAME COLUMN "datasetId" TO "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "doi" RENAME CONSTRAINT "UQ_eeddceee9c21ea9b0bf90adaa60" TO "UQ_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_c23192edae196c61acabfd8e610" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_c23192edae196c61acabfd8e610"`);
        await queryRunner.query(`ALTER TABLE "doi" RENAME CONSTRAINT "UQ_c23192edae196c61acabfd8e610" TO "UQ_eeddceee9c21ea9b0bf90adaa60"`);
        await queryRunner.query(`ALTER TABLE "doi" RENAME COLUMN "uploadedDatasetId" TO "datasetId"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_eeddceee9c21ea9b0bf90adaa60" FOREIGN KEY ("datasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
