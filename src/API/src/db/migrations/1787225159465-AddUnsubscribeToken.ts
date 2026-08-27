import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnsubscribeToken1787225159465 implements MigrationInterface {
    name = 'AddUnsubscribeToken1787225159465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "email_registry" ADD "unsubscription_token" character varying`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "email_registry" DROP COLUMN "unsubscription_token"`);
        
    }
}
