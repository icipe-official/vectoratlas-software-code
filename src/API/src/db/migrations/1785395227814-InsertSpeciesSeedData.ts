import { MigrationInterface, QueryRunner } from "typeorm";
import { RECORDED_SPECIES_DATA } from "../species/species.data";

export class InsertSpeciesSeedData1785395227814 implements MigrationInterface {
    name = 'InsertSpeciesSeedData1785395227814';

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!RECORDED_SPECIES_DATA || RECORDED_SPECIES_DATA.length === 0) return;

        console.log(`Seeding ${RECORDED_SPECIES_DATA.length} species into database...`);

        for (const item of RECORDED_SPECIES_DATA) {
            // 1. Check if this species already exists by name
            const existing = await queryRunner.query(
                `SELECT id, color FROM "recorded_species" WHERE "species" = $1 LIMIT 1`,
                [item.species]
            );

            if (existing && existing.length > 0) {
                // 2. If it exists, update it, but preserve any user-customized color if present
                await queryRunner.query(
                    `UPDATE "recorded_species" 
                     SET "display_name" = $1, 
                         "category" = $2, 
                         "color" = COALESCE("color", $3)
                     WHERE "species" = $4`,
                    [item.display_name, item.category, item.color, item.species]
                );
            } else {
                // 3. If it doesn't exist, insert it freshly
                await queryRunner.query(
                    `INSERT INTO "recorded_species" ("id", "species", "display_name", "category", "color")
                     VALUES ($1, $2, $3, $4, $5)`,
                    [item.id, item.species, item.display_name, item.category, item.color]
                );
            }
        }

        console.log('Successfully seeded species catalog data.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const speciesNames = RECORDED_SPECIES_DATA.map((s) => s.species);
        if (speciesNames.length > 0) {
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from('recorded_species')
                .where('species IN (:...speciesNames)', { speciesNames })
                .execute();
        }
    }
}