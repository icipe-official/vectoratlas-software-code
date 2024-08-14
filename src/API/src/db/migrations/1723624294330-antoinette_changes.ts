import { MigrationInterface, QueryRunner } from "typeorm";

export class AntoinetteChanges1723624294330 implements MigrationInterface {
    name = 'AntoinetteChanges1723624294330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infection" RENAME COLUMN "sr_by_dissection_perc" TO "sporozoite_rate_by_dissection_percent"`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" DROP COLUMN "ace1_280g_wildtype"`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" DROP COLUMN "ace1_280s_resistant"`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" DROP COLUMN "vgsc995.c_n"`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" DROP COLUMN "vgsc995f.s_n"`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" ADD "ace1_280g_percent" character varying`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" ADD "ace1_280s_percent" character varying`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" ADD "vgsc995l.vgsc995c_n" character varying`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" ADD "vgsc995f.vgsc995s_n" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" DROP COLUMN "vgsc995f.vgsc995s_n"`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" DROP COLUMN "vgsc995l.vgsc995c_n"`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" DROP COLUMN "ace1_280s_percent"`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" DROP COLUMN "ace1_280g_percent"`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" ADD "vgsc995f.s_n" character varying`);
        await queryRunner.query(`ALTER TABLE "vgscGeneytpeFrequencies" ADD "vgsc995.c_n" character varying`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" ADD "ace1_280s_resistant" character varying`);
        await queryRunner.query(`ALTER TABLE "ace1AlleleFrequencies" ADD "ace1_280g_wildtype" character varying`);
        await queryRunner.query(`ALTER TABLE "infection" RENAME COLUMN "sporozoite_rate_by_dissection_percent" TO "sr_by_dissection_perc"`);
    }

}
