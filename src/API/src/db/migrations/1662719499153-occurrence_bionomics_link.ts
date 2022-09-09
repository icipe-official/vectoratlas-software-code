import { MigrationInterface, QueryRunner } from "typeorm";

export class occurrenceBionomicsLink1662719499153 implements MigrationInterface {
    name = 'occurrenceBionomicsLink1662719499153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "bionomicsId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "UQ_53651a9635fba9560e81f76183f" UNIQUE ("bionomicsId")`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD "occurrenceId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "UQ_6116cca719e9b2b56b4837ae93f" UNIQUE ("occurrenceId")`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_53651a9635fba9560e81f76183f" FOREIGN KEY ("bionomicsId") REFERENCES "bionomics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_6116cca719e9b2b56b4837ae93f" FOREIGN KEY ("occurrenceId") REFERENCES "occurrence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_6116cca719e9b2b56b4837ae93f"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_53651a9635fba9560e81f76183f"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "UQ_6116cca719e9b2b56b4837ae93f"`);
        await queryRunner.query(`ALTER TABLE "bionomics" DROP COLUMN "occurrenceId"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "UQ_53651a9635fba9560e81f76183f"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "bionomicsId"`);
    }

}
