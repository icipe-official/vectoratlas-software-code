import { MigrationInterface, QueryRunner } from "typeorm";

export class FixKdrFrequencies1722935853817 implements MigrationInterface {
    name = 'FixKdrFrequencies1722935853817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e" FOREIGN KEY ("kdrGenotypeFrequenciesId") REFERENCES "kdrGenotypeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" DROP CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e"`);
        await queryRunner.query(`ALTER TABLE "insecticideResistanceBioassays" ADD CONSTRAINT "FK_71da7c36574477f7f2f8e63b60e" FOREIGN KEY ("kdrGenotypeFrequenciesId") REFERENCES "vgscGeneytpeFrequencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
