import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryRegionToUploadedDataset1728310034177 implements MigrationInterface {
    name = 'AddCountryRegionToUploadedDataset1728310034177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "source_country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "source_region" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "is_doi_requested" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "is_doi_requested"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "source_region"`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "source_country"`);
    }

}
