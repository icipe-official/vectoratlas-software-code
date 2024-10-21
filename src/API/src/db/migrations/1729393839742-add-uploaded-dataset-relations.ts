import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadedDatasetRelations1729393839742 implements MigrationInterface {
    name = 'AddUploadedDatasetRelations1729393839742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" RENAME COLUMN "datasetId" TO "uploadedDatasetId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD CONSTRAINT "FK_18e573b5e29a8fb1c30baf6a826" FOREIGN KEY ("uploadedDatasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" DROP CONSTRAINT "FK_18e573b5e29a8fb1c30baf6a826"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" RENAME COLUMN "uploadedDatasetId" TO "datasetId"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset_log" ADD CONSTRAINT "FK_8c605fe415b25ba9dbbffda6613" FOREIGN KEY ("datasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
