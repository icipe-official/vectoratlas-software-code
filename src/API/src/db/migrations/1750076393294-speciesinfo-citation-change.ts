import { MigrationInterface, QueryRunner } from "typeorm";

export class SpeciesinfoCitationChange1750076393294 implements MigrationInterface {
    name = 'SpeciesinfoCitationChange1750076393294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species_information" ALTER COLUMN "citations" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species_information" ALTER COLUMN "citations" DROP NOT NULL`);
    }

}
