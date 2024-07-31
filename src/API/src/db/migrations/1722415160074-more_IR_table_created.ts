import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreIRTableCreated1722415160074 implements MigrationInterface {
    name = 'MoreIRTableCreated1722415160074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vgsc1570GenotypeFrequencies" ("id" character varying(256) NOT NULL, "vgsc1570n.vgsc1570n_n" character varying, "vgsc1570n.vgsc1570n_percent" character varying, "vgsc1570n.vgsc1570y_n" character varying, "vgsc1570n.1570y_percent" character varying, "vgsc1570y.vgsc1570y_n" character varying, "vgsc1570y.vgsc1570y_percent" character varying, CONSTRAINT "PK_afc70b4b9c77a9a311f7f92be83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vgsc1570AlleleFrequencies" ("id" character varying(256) NOT NULL, "vgsc1570n_percent" character varying, "vgsc1570y_percent" character varying, CONSTRAINT "PK_0c3779084b09aea1a0127cd76f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rdlMethodAndSample" ("id" character varying(256) NOT NULL, "rdl_method_1" character varying, "rdl_no_of_mosquitoes_tested" character varying, "rdl_generation" character varying, "rdl_notes" character varying, CONSTRAINT "PK_b541ca1339cb29c3041d9993e3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rdl296GenotypeFrequencies" ("id" character varying(256) NOT NULL, "rdl296c.rdl296c_n" character varying, "rdl296c.rdl296c_percent" character varying, "rdl296c.rdl296g_n" character varying, "rdl296c.rdl296g_percent" character varying, "rdl296g.rdl296g_n" character varying, "rdl296g.rdl296g_percent" character varying, "rdl296c.rdl296s_n" character varying, "rdl296c.rdl296s_percent" character varying, "rdl296s.rdl296s_n" character varying, "rdl296s.rdl296s_percent" character varying, "rdl296g.rdl296s_n" character varying, "rdl296g.rdl296s_percent" character varying, CONSTRAINT "PK_9f5914a0deac2564a633d541b57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rdl296AlleleFrequencies" ("id" character varying(256) NOT NULL, "rdl296c_percent" character varying, "rdl296g_percent" character varying, "rdl296s_percent" character varying, CONSTRAINT "PK_f004ba6ac0801f0f50fb88c6bd4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ace1MethodAndSample" ("id" character varying(256) NOT NULL, "ace1_method_1" character varying, "ace1_no_of_mosquitoes_tested" character varying, "ace1_generation" character varying, "ace1_notes" character varying, CONSTRAINT "PK_9c144707a104a8b13f8d12c114a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ace1GenotypeFrequencies" ("id" character varying(256) NOT NULL, "ace1_280g.ace1_280g_n" character varying, "ace1_280g.ace1_280g_percent" character varying, "ace1_280g.ace1_280s_n" character varying, "ace1_280g.ace1_280s_percent" character varying, "ace1_280s.ace1_280s_n" character varying, "ace1_280s.ace1_280s_percent" character varying, CONSTRAINT "PK_fa46982aadb46d208bd9781de09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ace1AlleleFrequencies" ("id" character varying(256) NOT NULL, "ace1_280g_wildtype" character varying, "ace1_280s_resistant" character varying, CONSTRAINT "PK_89e35ce3d955a3bb684aae5efab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gsteMethodAndSample" ("id" character varying(256) NOT NULL, "gste_method_1" character varying, "gste_no_of_mosquitoes_tested" character varying, "gste_generation" character varying, "gste_notes" character varying, CONSTRAINT "PK_088f45e5c3483c7ef2bd1c34f24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc1570GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_c689d9b00b9912fc53d00a3190b" UNIQUE ("vgsc1570GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc1570AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_d65340e159b8ad262c2c18eacae" UNIQUE ("vgsc1570AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdlMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_5c2dbec8223b1fa5583785a10c3" UNIQUE ("rdlMethodAndSampleId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdl296GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_7c6e0bfb4cdb7ab15c3208bb4be" UNIQUE ("rdl296GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "rdl296AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_a90795d4f2f5fc124894b3b3a84" UNIQUE ("rdl296AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1MethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_f4391b16d3f962d1d0d6f9faad9" UNIQUE ("ace1MethodAndSampleId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_e8ad2170daea8f0776244b6eb31" UNIQUE ("ace1GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "ace1AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_a63eb2d28736b29d8aaad14a5e5" UNIQUE ("ace1AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gsteMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_db66b64387929689e18d4439b1c" UNIQUE ("gsteMethodAndSampleId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_c689d9b00b9912fc53d00a3190b" FOREIGN KEY ("vgsc1570GenotypeFrequenciesId") REFERENCES "vgsc1570GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_d65340e159b8ad262c2c18eacae" FOREIGN KEY ("vgsc1570AlleleFrequenciesId") REFERENCES "vgsc1570AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_d65340e159b8ad262c2c18eacae"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_c689d9b00b9912fc53d00a3190b"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_db66b64387929689e18d4439b1c"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gsteMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_a63eb2d28736b29d8aaad14a5e5"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_e8ad2170daea8f0776244b6eb31"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_f4391b16d3f962d1d0d6f9faad9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "ace1MethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_a90795d4f2f5fc124894b3b3a84"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdl296AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_7c6e0bfb4cdb7ab15c3208bb4be"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdl296GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_5c2dbec8223b1fa5583785a10c3"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "rdlMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_d65340e159b8ad262c2c18eacae"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc1570AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_c689d9b00b9912fc53d00a3190b"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc1570GenotypeFrequenciesId"`);
        await queryRunner.query(`DROP TABLE "gsteMethodAndSample"`);
        await queryRunner.query(`DROP TABLE "ace1AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "ace1GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "ace1MethodAndSample"`);
        await queryRunner.query(`DROP TABLE "rdl296AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "rdl296GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "rdlMethodAndSample"`);
        await queryRunner.query(`DROP TABLE "vgsc1570AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "vgsc1570GenotypeFrequencies"`);
    }

}
