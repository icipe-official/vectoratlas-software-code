import { MigrationInterface, QueryRunner } from "typeorm";

export class FixIrRelationships1722935631296 implements MigrationInterface {
    name = 'FixIrRelationships1722935631296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdlMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdl296GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdl296AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1MethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gsteMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_5c2dbec8223b1fa5583785a10c3" FOREIGN KEY ("rdlMethodAndSampleId") REFERENCES "rdlMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_7c6e0bfb4cdb7ab15c3208bb4be" FOREIGN KEY ("rdl296GenotypeFrequenciesId") REFERENCES "rdl296GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_a90795d4f2f5fc124894b3b3a84" FOREIGN KEY ("rdl296AlleleFrequenciesId") REFERENCES "rdl296AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_f4391b16d3f962d1d0d6f9faad9" FOREIGN KEY ("ace1MethodAndSampleId") REFERENCES "ace1MethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_e8ad2170daea8f0776244b6eb31" FOREIGN KEY ("ace1GenotypeFrequenciesId") REFERENCES "ace1GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_a63eb2d28736b29d8aaad14a5e5" FOREIGN KEY ("ace1AlleleFrequenciesId") REFERENCES "ace1AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_db66b64387929689e18d4439b1c" FOREIGN KEY ("gsteMethodAndSampleId") REFERENCES "gsteMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_db66b64387929689e18d4439b1c"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_a63eb2d28736b29d8aaad14a5e5"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_e8ad2170daea8f0776244b6eb31"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_f4391b16d3f962d1d0d6f9faad9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_a90795d4f2f5fc124894b3b3a84"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_7c6e0bfb4cdb7ab15c3208bb4be"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_5c2dbec8223b1fa5583785a10c3"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gsteMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1MethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdl296AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdl296GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdlMethodAndSampleId"`);
    }

}
