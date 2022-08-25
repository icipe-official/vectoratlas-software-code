import { MigrationInterface, QueryRunner } from "typeorm";

export class foreignKeys1661352914933 implements MigrationInterface {
    name = 'foreignKeys1661352914933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "biologyId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_f5707b7206f9b94b0e53476909d" UNIQUE ("biologyId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "infectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_ef1c9d91807c836c714ce6fd589" UNIQUE ("infectionId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "bitingRateId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_45afe190a7c60150ad333cdcfa1" UNIQUE ("bitingRateId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "anthropoZoophagicId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_be07c46beb3c24f41a3a3715596" UNIQUE ("anthropoZoophagicId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "endoExophagicId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_6580eea7f5d8cbce7c40bada2a4" UNIQUE ("endoExophagicId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "bitingActivityId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_da63932571ddc6bda157bd3d8cc" UNIQUE ("bitingActivityId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "endoExophilyId" uuid`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_de7b58582f44473a538d91a61ed" UNIQUE ("endoExophilyId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES "biology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589" FOREIGN KEY ("infectionId") REFERENCES "infection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1" FOREIGN KEY ("bitingRateId") REFERENCES "biting_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_be07c46beb3c24f41a3a3715596" FOREIGN KEY ("anthropoZoophagicId") REFERENCES "anthropo_zoophagic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4" FOREIGN KEY ("endoExophagicId") REFERENCES "endo_exophagic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc" FOREIGN KEY ("bitingActivityId") REFERENCES "biting_activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_de7b58582f44473a538d91a61ed" FOREIGN KEY ("endoExophilyId") REFERENCES "endo_exophily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_de7b58582f44473a538d91a61ed"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_be07c46beb3c24f41a3a3715596"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_f5707b7206f9b94b0e53476909d"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_de7b58582f44473a538d91a61ed"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "endoExophilyId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_da63932571ddc6bda157bd3d8cc"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "bitingActivityId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_6580eea7f5d8cbce7c40bada2a4"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "endoExophagicId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_be07c46beb3c24f41a3a3715596"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "anthropoZoophagicId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_45afe190a7c60150ad333cdcfa1"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "bitingRateId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_ef1c9d91807c836c714ce6fd589"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "infectionId"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_f5707b7206f9b94b0e53476909d"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "biologyId"`);
    }

}
