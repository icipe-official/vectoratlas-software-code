import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationshipsIrFix1722933796270 implements MigrationInterface {
    name = 'RelationshipsIrFix1722933796270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD "cytochromesP450_cypMethodAndSample_id" character varying`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "UQ_73fc9b5a037626bf2bb9b190224" UNIQUE ("cytochromesP450_cypMethodAndSample_id")`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_73fc9b5a037626bf2bb9b190224" FOREIGN KEY ("cytochromesP450_cypMethodAndSample_id") REFERENCES "cytochromesP450_cypMethodAndSample"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_73fc9b5a037626bf2bb9b190224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "UQ_73fc9b5a037626bf2bb9b190224"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP COLUMN "cytochromesP450_cypMethodAndSample_id"`);
    }

}
