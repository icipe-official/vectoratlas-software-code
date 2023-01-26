import { MigrationInterface, QueryRunner } from "typeorm";

export class createDataset1673256699510 implements MigrationInterface {
    name = 'createDataset1673256699510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dataset" ("id" character varying(256) NOT NULL, "status" character varying, "UpdatedBy" character varying, "UpdatedAt" TIMESTAMP WITH TIME ZONE, "ReviewedBy" character varying array DEFAULT'{}', "ReviewedAt" TIMESTAMP WITH TIME ZONE array DEFAULT'{}', CONSTRAINT "PK_36c1c67adb3d1dd69ae57f18913" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dataset" ADD "ApprovedBy" character varying array DEFAULT'{}', ADD "ApprovedAt" TIMESTAMP WITH TIME ZONE array DEFAULT'{}'`)
        await queryRunner.query(`INSERT INTO "dataset" ("id") VALUES ('initial-id') `);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "datasetId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "datasetId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_1350aeebd51e784661ee8adbec2" FOREIGN KEY ("datasetId") REFERENCES "dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_7110b55018b4e1a919bada31ab1" FOREIGN KEY ("datasetId") REFERENCES "dataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "bionomics" SET "datasetId"='initial-id'`);
        await queryRunner.query(`UPDATE "occurrence" SET "datasetId"='initial-id'`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "datasetId" SET NOT NULL`)
        await queryRunner.query(`ALTER TABLE "occurrence" ALTER COLUMN "datasetId" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_7110b55018b4e1a919bada31ab1"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_1350aeebd51e784661ee8adbec2"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "datasetId"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "datasetId"`);
        await queryRunner.query(`DROP TABLE "dataset"`);
    }

}
