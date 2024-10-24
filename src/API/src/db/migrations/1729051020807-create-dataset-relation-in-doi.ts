import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatasetRelationInDoi1729051020807 implements MigrationInterface {
    name = 'CreateDatasetRelationInDoi1729051020807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "is_reviewerManager"`);
        await queryRunner.query(`ALTER TABLE "doi" ADD "datasetId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "UQ_eeddceee9c21ea9b0bf90adaa60" UNIQUE ("datasetId")`);
        await queryRunner.query(`ALTER TABLE "doi" ADD CONSTRAINT "FK_eeddceee9c21ea9b0bf90adaa60" FOREIGN KEY ("datasetId") REFERENCES "uploaded_dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "FK_eeddceee9c21ea9b0bf90adaa60"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP CONSTRAINT "UQ_eeddceee9c21ea9b0bf90adaa60"`);
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "datasetId"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "is_reviewerManager" boolean`);
    }

}
