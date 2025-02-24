import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDoiLinkField1740408897644 implements MigrationInterface {
    name = 'AddDoiLinkField1740408897644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" ADD "doi_link" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doi" DROP COLUMN "doi_link"`);
    }

}
