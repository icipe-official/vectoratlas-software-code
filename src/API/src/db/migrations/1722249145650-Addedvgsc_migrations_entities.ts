import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedvgscMigrationsEntities1722249145650 implements MigrationInterface {
    name = 'AddedvgscMigrationsEntities1722249145650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vgscGeneytpeFrequencies" ("id" character varying(256) NOT NULL, "vgsc995l.vgsc995l_n" character varying, "vgsc995l.vgsc995l_percent" character varying, "vgsc995l.vgsc995f_n" character varying, "vgsc995l.vgsc995f_percent" character varying, "vgsc995f.vgsc995f_n" character varying, "vgsc995f.vgsc995f_percent" character varying, "vgsc995l.vgsc995s_n" character varying, "vgsc995l.vgsc995s_percent" character varying, "vgsc995s.vgsc995s_n" character varying, "vgsc995s.vgsc995s_percent" character varying, "vgsc995.c_n" character varying, "vgsc995l.vgsc995c_percent" character varying, "vgsc995c.vgsc995c_n" character varying, "vgsc995c.vgsc995c_percent" character varying, "null.vgsc995c_or_vgsc995c.vgsc995c_n" character varying, "null.vgsc995c_or_vgsc995c.vgsc995c_percent" character varying, "vgsc995f.s_n" character varying, "vgsc995f.vgsc995s_percent" character varying, "vgsc995f.vgsc995c_n" character varying, "vgsc995f.vgsc995c_percent" character varying, CONSTRAINT "PK_8bec77b1b988f3d942e4abfcdb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vgscMethodAndSample" ("id" character varying(256) NOT NULL, "vgsc_method_1" character varying, "vgsc_method_2" character varying, "vgsc_no_of_mosquitors_tested" character varying, "vgsc_generation" character varying, "vgsc_kdr_notes" character varying, CONSTRAINT "PK_d97af190bdab522a430697cf741" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgscMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_2539c8246b81d7b88b4891f444d" UNIQUE ("vgscMethodAndSampleId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgscGeneytpeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_44fbde14be988ce4dda121577a9" UNIQUE ("vgscGeneytpeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_2539c8246b81d7b88b4891f444d" FOREIGN KEY ("vgscMethodAndSampleId") REFERENCES "vgscMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_44fbde14be988ce4dda121577a9" FOREIGN KEY ("vgscGeneytpeFrequenciesId") REFERENCES "vgscGeneytpeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_44fbde14be988ce4dda121577a9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_2539c8246b81d7b88b4891f444d"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_44fbde14be988ce4dda121577a9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgscGeneytpeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_2539c8246b81d7b88b4891f444d"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgscMethodAndSampleId"`);
        await queryRunner.query(`DROP TABLE "vgscMethodAndSample"`);
        await queryRunner.query(`DROP TABLE "vgscGeneytpeFrequencies"`);
    }

}
