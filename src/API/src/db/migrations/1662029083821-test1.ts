import { MigrationInterface, QueryRunner } from "typeorm";

export class test11662029083821 implements MigrationInterface {
    name = 'test11662029083821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_f5707b7206f9b94b0e53476909d"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "biologyId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES "biology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bionomics" DROP CONSTRAINT "FK_f5707b7206f9b94b0e53476909d"`);
        await queryRunner.query(`ALTER TABLE "bionomics" ALTER COLUMN "biologyId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bionomics" ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES "biology"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
