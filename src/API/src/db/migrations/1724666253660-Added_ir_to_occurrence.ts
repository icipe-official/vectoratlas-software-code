import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIrToOccurrence1724666253660 implements MigrationInterface {
    name = 'AddedIrToOccurrence1724666253660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" ADD "insecticideResistanceBioassaysId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "occurrence" ADD CONSTRAINT "FK_fdc798eb75cad9686e1e610537d" FOREIGN KEY ("insecticideResistanceBioassaysId") REFERENCES "insecticideResistanceBioassays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "occurrence" DROP CONSTRAINT "FK_fdc798eb75cad9686e1e610537d"`);
        await queryRunner.query(`ALTER TABLE "occurrence" DROP COLUMN "insecticideResistanceBioassaysId"`);
    }

}
