import { MigrationInterface, QueryRunner } from "typeorm";

export class EndOfIrTables1722417493374 implements MigrationInterface {
    name = 'EndOfIrTables1722417493374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cyp6aapAlleleFrequencies" ("id" character varying(256) NOT NULL, "cyp6aap.wt_percent" character varying, "cyp6aap.dup1_percent" character varying, CONSTRAINT "PK_795ddbcd9f028caae3718b1529d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cyp6aapGenotypeFrequencies" ("id" character varying(256) NOT NULL, "cyp6aap.wt.cyp6aap.wt_n" character varying, "cyp6aap.wt.cyp6aap.wt_percent" character varying, "cyp6aap.wt.cyp6aap.dup1_n" character varying, "cyp6aap.wt.cyp6aap.dup1_percent" character varying, "cyp6aap.dup1.cyp6aap.dup1_n" character varying, "cyp6aap.dup1.cyp6aap.dup1_percent" character varying, CONSTRAINT "PK_86fca40bd3d3526b7ff0c8bc703" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cyp6p4AlleleFrequencies" ("id" character varying(256) NOT NULL, "cyp6p4.236wt_percent" character varying, "cyp6p4.236m_percent" character varying, CONSTRAINT "PK_59713681b0b581f2142016be9d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cyp4j5AlleleFrequencies" ("id" character varying(256) NOT NULL, "cyp4j5.43l_percent" character varying, "cyp4j5.43f_percent" character varying, CONSTRAINT "PK_d25124c7e71a432ae93ad0c6aa8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cyp4j5GenotypeFrequencies" ("id" character varying(256) NOT NULL, "cyp4j5_43l.cyp4j5_43l_n" character varying, "cyp4j5_43l.cyp4j5_43l_percent" character varying, "cyp4j5_43l.cyp4j5_43f_n" character varying, "cyp4j5_43l.cyp4j5_43f_percent" character varying, "cyp4j5_43f.cyp4j5_43f_n" character varying, "cyp4j5_43f.cyp4j5_43f_percent" character varying, CONSTRAINT "PK_24bf2595067b01f8fe04dafd57b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cytochromesP450_cypMethodAndSample" ("id" character varying(256) NOT NULL, "cyp_method_1" character varying, "cyp_number_of_mosquitoes_tested" character varying, "cyp_generation" character varying, "cyp_notes" character varying, CONSTRAINT "PK_611b7d7e2c1852b483ba8ad0c10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gste2_119AlleleFrequencies" ("id" character varying(256) NOT NULL, "gste2_119l_percent" character varying, "gste2_119v_percent" character varying, CONSTRAINT "PK_bb1fdf4030f0e1a8f0e83caed26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gste2_119GenotypeFrequencies" ("id" character varying(256) NOT NULL, "gste2_119l.gste2_119l_n" character varying, "gste2_119l.gste2_119l_percent" character varying, "gste2_119l.gste2_119v_n" character varying, "gste2_119l.gste2_119v_percent" character varying, "gste2_119v.gste2_119v_n" character varying, "gste2_119v.gste2_119v_percent" character varying, CONSTRAINT "PK_4148f9f4bfc21877468c9ccc9a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gste2_114AlleleFrequencies" ("id" character varying(256) NOT NULL, "gste2_114I_percent" character varying, "gste2_114t_percent" character varying, CONSTRAINT "PK_48a2be6a2f7d4da1bfbea1817a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gste2_114GenotypeFrequencies" ("id" character varying(256) NOT NULL, "gste2_114I.gste2_114I_n" character varying, "gste2_114I.gste2_114I_percent" character varying, "gste2_114I.gste2_114t_n" character varying, "gste2_114I.gste2_114t_percent" character varying, "gste2_114t.gste2_114t_n" character varying, "gste2_114t.gste2_114t_percent" character varying, CONSTRAINT "PK_a57a7f3b2c723e6f82628f85e04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cyp6p4GenotypeFrequencies" ("id" character varying(256) NOT NULL, "cyp6p4.236wt_cyp6p4.236wt_n" character varying, "cyp6p4.236wt_cyp6p4.236wt_percent" character varying, "cyp6p4.236wt_cyp6p4.236m_n" character varying, "cyp6p4.236wt_cyp6p4.236m_percent" character varying, "cyp6p4.236m_cyp6p4.236m_n" character varying, "cyp6p4.236m_cyp6p4.236m_percent" character varying, CONSTRAINT "PK_4a5a639191c6ff2809e54c366e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6aapAlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_65a9c0edce08b53c22c88621a6f" UNIQUE ("cyp6aapAlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6aapGenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_63f4d1c7ed32a882a05fbcf8a66" UNIQUE ("cyp6aapGenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6p4AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_edc898abf26192fc4ca2c67ea32" UNIQUE ("cyp6p4AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6p4GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_736b893b14c20855287ea1c27d9" UNIQUE ("cyp6p4GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp4j5AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_4944017cff3a475b5dea94d4224" UNIQUE ("cyp4j5AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp4j5GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_a6faeed18969535c626efcb9811" UNIQUE ("cyp4j5GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cytochromesP450CypMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_2f3b60260a0b8921963ee18c59a" UNIQUE ("cytochromesP450CypMethodAndSampleId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2119AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_d241f1d94efb196f2d9e7ff8906" UNIQUE ("gste2119AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2119GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_8b283fcfd5356000890d4e630a4" UNIQUE ("gste2119GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2114AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_ab3f4fcff9bf709ff3071ef621b" UNIQUE ("gste2114AlleleFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2114GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_753920ae3aa0ae7754ad0554235" UNIQUE ("gste2114GenotypeFrequenciesId")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_65a9c0edce08b53c22c88621a6f" FOREIGN KEY ("cyp6aapAlleleFrequenciesId") REFERENCES "cyp6aapAlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_63f4d1c7ed32a882a05fbcf8a66" FOREIGN KEY ("cyp6aapGenotypeFrequenciesId") REFERENCES "cyp6aapGenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_edc898abf26192fc4ca2c67ea32" FOREIGN KEY ("cyp6p4AlleleFrequenciesId") REFERENCES "cyp6p4AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_736b893b14c20855287ea1c27d9" FOREIGN KEY ("cyp6p4GenotypeFrequenciesId") REFERENCES "cyp6p4GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_4944017cff3a475b5dea94d4224" FOREIGN KEY ("cyp4j5AlleleFrequenciesId") REFERENCES "cyp4j5AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_a6faeed18969535c626efcb9811" FOREIGN KEY ("cyp4j5GenotypeFrequenciesId") REFERENCES "cyp4j5GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_2f3b60260a0b8921963ee18c59a" FOREIGN KEY ("cytochromesP450CypMethodAndSampleId") REFERENCES "cytochromesP450_cypMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_d241f1d94efb196f2d9e7ff8906" FOREIGN KEY ("gste2119AlleleFrequenciesId") REFERENCES "gste2_119AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_8b283fcfd5356000890d4e630a4" FOREIGN KEY ("gste2119GenotypeFrequenciesId") REFERENCES "gste2_119GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_ab3f4fcff9bf709ff3071ef621b" FOREIGN KEY ("gste2114AlleleFrequenciesId") REFERENCES "gste2_114AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_753920ae3aa0ae7754ad0554235" FOREIGN KEY ("gste2114GenotypeFrequenciesId") REFERENCES "gste2_114GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_753920ae3aa0ae7754ad0554235"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_ab3f4fcff9bf709ff3071ef621b"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_8b283fcfd5356000890d4e630a4"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_d241f1d94efb196f2d9e7ff8906"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_2f3b60260a0b8921963ee18c59a"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_a6faeed18969535c626efcb9811"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_4944017cff3a475b5dea94d4224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_736b893b14c20855287ea1c27d9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_edc898abf26192fc4ca2c67ea32"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_63f4d1c7ed32a882a05fbcf8a66"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_65a9c0edce08b53c22c88621a6f"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_753920ae3aa0ae7754ad0554235"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2114GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_ab3f4fcff9bf709ff3071ef621b"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2114AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_8b283fcfd5356000890d4e630a4"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2119GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_d241f1d94efb196f2d9e7ff8906"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2119AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_2f3b60260a0b8921963ee18c59a"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cytochromesP450CypMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_a6faeed18969535c626efcb9811"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp4j5GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_4944017cff3a475b5dea94d4224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp4j5AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_736b893b14c20855287ea1c27d9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6p4GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_edc898abf26192fc4ca2c67ea32"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6p4AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_63f4d1c7ed32a882a05fbcf8a66"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6aapGenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_65a9c0edce08b53c22c88621a6f"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6aapAlleleFrequenciesId"`);
        await queryRunner.query(`DROP TABLE "cyp6p4GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "gste2_114GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "gste2_114AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "gste2_119GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "gste2_119AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "cytochromesP450_cypMethodAndSample"`);
        await queryRunner.query(`DROP TABLE "cyp4j5GenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "cyp4j5AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "cyp6p4AlleleFrequencies"`);
        await queryRunner.query(`DROP TABLE "cyp6aapGenotypeFrequencies"`);
        await queryRunner.query(`DROP TABLE "cyp6aapAlleleFrequencies"`);
    }

}
