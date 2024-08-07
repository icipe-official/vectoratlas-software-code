import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedManyToOneRelationship1722935302180 implements MigrationInterface {
    name = 'AddedManyToOneRelationship1722935302180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_73fc9b5a037626bf2bb9b190224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_73fc9b5a037626bf2bb9b190224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cytochromesP450_cypMethodAndSample_id"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "biologyId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "infectionId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "bitingRateId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "anthropoZoophagicId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "endoExophagicId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "bitingActivityId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "endoExophilyId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "environmentId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "larvalSiteId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "genotypicRepresentativenessId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgscMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgscGeneytpeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "kdrGenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc995AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc402GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc402AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6aapAlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6aapGenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6p4AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp6p4GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp4j5AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cyp4j5GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cytochromesP450CypMethodAndSampleId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2119AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2119GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2114AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "gste2114GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc1570GenotypeFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "vgsc1570AlleleFrequenciesId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES "biology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589" FOREIGN KEY ("infectionId") REFERENCES "infection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1" FOREIGN KEY ("bitingRateId") REFERENCES "biting_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_be07c46beb3c24f41a3a3715596" FOREIGN KEY ("anthropoZoophagicId") REFERENCES "anthropo_zoophagic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4" FOREIGN KEY ("endoExophagicId") REFERENCES "endo_exophagic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc" FOREIGN KEY ("bitingActivityId") REFERENCES "biting_activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_de7b58582f44473a538d91a61ed" FOREIGN KEY ("endoExophilyId") REFERENCES "endo_exophily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_b7b6e0077e7331785abad7f2b1e" FOREIGN KEY ("environmentId") REFERENCES "environment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_aa52ec7238f9cc4b065049209af" FOREIGN KEY ("larvalSiteId") REFERENCES "Larval_site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_9a0f87904bbee0a3f6c9a5e1174" FOREIGN KEY ("genotypicRepresentativenessId") REFERENCES "genotypicRepresentativeness"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_2539c8246b81d7b88b4891f444d" FOREIGN KEY ("vgscMethodAndSampleId") REFERENCES "vgscMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_44fbde14be988ce4dda121577a9" FOREIGN KEY ("vgscGeneytpeFrequenciesId") REFERENCES "vgscGeneytpeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e" FOREIGN KEY ("kdrGenotypeFrequenciesId") REFERENCES "vgscGeneytpeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_adaf447d10ae7ea12848c4d33e1" FOREIGN KEY ("vgsc995AlleleFrequenciesId") REFERENCES "vgsc995AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_535d24774bc5e47c62315acc1b1" FOREIGN KEY ("vgsc402GenotypeFrequenciesId") REFERENCES "vgsc402GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_433df12576baa25c8231b2e1163" FOREIGN KEY ("vgsc402AlleleFrequenciesId") REFERENCES "vgsc402AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_c689d9b00b9912fc53d00a3190b" FOREIGN KEY ("vgsc1570GenotypeFrequenciesId") REFERENCES "vgsc1570GenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_d65340e159b8ad262c2c18eacae" FOREIGN KEY ("vgsc1570AlleleFrequenciesId") REFERENCES "vgsc1570AlleleFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_d65340e159b8ad262c2c18eacae"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_c689d9b00b9912fc53d00a3190b"`);
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
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_433df12576baa25c8231b2e1163"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_535d24774bc5e47c62315acc1b1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_adaf447d10ae7ea12848c4d33e1"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_44fbde14be988ce4dda121577a9"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_2539c8246b81d7b88b4891f444d"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_9a0f87904bbee0a3f6c9a5e1174"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_aa52ec7238f9cc4b065049209af"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_b7b6e0077e7331785abad7f2b1e"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_de7b58582f44473a538d91a61ed"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_be07c46beb3c24f41a3a3715596"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_f5707b7206f9b94b0e53476909d"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc1570AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc1570GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2114GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2114AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2119GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "gste2119AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cytochromesP450CypMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp4j5GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp4j5AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6p4GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6p4AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6aapGenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cyp6aapAlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc402AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc402GenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgsc995AlleleFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "kdrGenotypeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgscGeneytpeFrequenciesId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "vgscMethodAndSampleId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "genotypicRepresentativenessId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "larvalSiteId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "environmentId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "endoExophilyId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "bitingActivityId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "endoExophagicId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "anthropoZoophagicId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "bitingRateId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "infectionId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "biologyId"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cytochromesP450_cypMethodAndSample_id" character varying`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_73fc9b5a037626bf2bb9b190224" UNIQUE ("cytochromesP450_cypMethodAndSample_id")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_73fc9b5a037626bf2bb9b190224" FOREIGN KEY ("cytochromesP450_cypMethodAndSample_id") REFERENCES "cytochromesP450_cypMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
