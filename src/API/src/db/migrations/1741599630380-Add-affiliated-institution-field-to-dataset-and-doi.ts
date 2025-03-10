import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAffiliatedInstitutionFieldToDatasetAndDoi1741599630380 implements MigrationInterface {
    name = 'AddAffiliatedInstitutionFieldToDatasetAndDoi1741599630380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" ADD "affiliated_institution" character varying`);
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" ADD "affiliated_institution" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "uploaded_dataset" DROP COLUMN "affiliated_institution"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "affiliated_institution"`);
    }

}
