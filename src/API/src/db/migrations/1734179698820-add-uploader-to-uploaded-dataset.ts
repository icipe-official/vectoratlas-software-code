import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploaderToUploadedDataset1734179698820 implements MigrationInterface {
    name = 'AddUploaderToUploadedDataset1734179698820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" ADD "creator" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "uploader" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "uploader"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "creator"`);
    }

}
