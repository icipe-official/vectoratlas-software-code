import { MigrationInterface, QueryRunner } from "typeorm";

export class Addedvgsc402MigrationsEntities1722251069625 implements MigrationInterface {
    name = 'Addedvgsc402MigrationsEntities1722251069625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "kdrGenotypeFrequencies" ("id" character varying(256) NOT NULL, "susceptible.susceptible_n" character varying, "susceptible.susceptible_percent" character varying, "resistant.susceptible_n" character varying, "resistant.susceptible_percent" character varying, "resistant.resistant_n" character varying, "resistant.resistant_percent" character varying, CONSTRAINT "PK_536fb5867adc036b6e1ea279e40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vgsc995AlleleFrequencies" ("id" character varying(256) NOT NULL, "vgsc995l_percent" character varying, "vgsc995f_percent" character varying, "vgsc995s_percent" character varying, "vgsc995c_percent" character varying, "kdr_percent" character varying, CONSTRAINT "PK_352288bfa0574e378283cc6dfb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vgsc402GenotypeFrequencies" ("id" character varying(256) NOT NULL, "vgsc402v.vgsc402v_n" character varying, "vgsc402v.vgsc402v_percent" character varying, "vgsc402v.vgsc402l_n" character varying, "vgsc402v.vgsc402l_percent" character varying, "vgsc402l.vgsc402l_n" character varying, "vgsc402l.vgsc402l_percent" character varying, CONSTRAINT "PK_acc7153d60c66ebe6055a79ebea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vgsc402AlleleFrequencies" ("id" character varying(256) NOT NULL, "vgsc402v_percent" character varying, "vgsc.402l_percent" character varying, CONSTRAINT "PK_3c5c0d2e7d5b95c8002dc7df4b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "kdrGenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_71da7c36574477f7f2f8e63b60e" UNIQUE ("kdrGenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc995AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_adaf447d10ae7ea12848c4d33e1" UNIQUE ("vgsc995AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc402GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_535d24774bc5e47c62315acc1b1" UNIQUE ("vgsc402GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc402AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_433df12576baa25c8231b2e1163" UNIQUE ("vgsc402AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e" FOREIGN KEY ("kdrGenotypeFrequenciesId") REFERENCES "vgscGeneytpeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_adaf447d10ae7ea12848c4d33e1" FOREIGN KEY ("vgsc995AlleleFrequenciesId") REFERENCES "vgsc995AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_535d24774bc5e47c62315acc1b1" FOREIGN KEY ("vgsc402GenotypeFrequenciesId") REFERENCES "vgsc402GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_433df12576baa25c8231b2e1163" FOREIGN KEY ("vgsc402AlleleFrequenciesId") REFERENCES "vgsc402AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_433df12576baa25c8231b2e1163"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_535d24774bc5e47c62315acc1b1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_adaf447d10ae7ea12848c4d33e1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_433df12576baa25c8231b2e1163"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc402AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_535d24774bc5e47c62315acc1b1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc402GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_adaf447d10ae7ea12848c4d33e1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc995AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_71da7c36574477f7f2f8e63b60e"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "kdrGenotypeFrequenciesId"`);
        await queryRunner.query(`DROP TABLE "vgsc402AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "vgsc402GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "vgsc995AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "kdrGenotypeFrequencies"`);
    }

}
