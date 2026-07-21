import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToRecordedSpecies1783516161726 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "display_name" varchar`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "category" varchar`);
        await queryRunner.query(`ALTER TABLE "recorded_species" ADD COLUMN IF NOT EXISTS "color" varchar`);

        
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION populate_recorded_species()
            RETURNS TRIGGER AS $$
            BEGIN
             
                IF NEW.display_name IS NULL THEN 
                    NEW.display_name := NEW.species;
                END IF;

        
                IF NEW.category IS NULL THEN 
                    IF NEW.species IN (
                        'arabiensis', 'coluzzii', 'gambiae', 'gambiae_s form', 
                        'gambiae/An. coluzzii', 'coluzzii_gambiae_m form', 'funestus'
                    ) THEN
                        NEW.category := 'Primary';
                    ELSE
                        NEW.category := 'Secondary';
                    END IF;
                END IF;

               
                IF NEW.color IS NULL THEN
                    IF NEW.category = 'Secondary' THEN
                        NEW.color := '#038543'; 
                    ELSE
                        CASE NEW.species
                            WHEN 'arabiensis' THEN NEW.color := '#252676';
                            WHEN 'coluzzii' THEN NEW.color := '#badadd';
                            WHEN 'coluzzii_gambiae_m form' THEN NEW.color := '#badadd';
                            WHEN 'funestus' THEN NEW.color := '#47a2f7';
                            WHEN 'gambiae' THEN NEW.color := '#521986';
                            WHEN 'gambiae_s form' THEN NEW.color := '#521986';
                            WHEN 'gambiae/An. coluzzii' THEN NEW.color := '#065668';
                            WHEN 'gambiae_s form_m form' THEN NEW.color := '#065668';
                            ELSE NEW.color := '#038543';
                        END CASE;
                    END IF;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        
        await queryRunner.query(`DROP TRIGGER IF EXISTS t_populate_recorded_species ON "recorded_species"`);
        await queryRunner.query(`
            CREATE TRIGGER t_populate_recorded_species
            BEFORE INSERT OR UPDATE ON "recorded_species"
            FOR EACH ROW 
            EXECUTE PROCEDURE populate_recorded_species();
        `);

      
        await queryRunner.query(`
            UPDATE "recorded_species" 
            SET 
                display_name = COALESCE(display_name, species),
                category = CASE 
                    WHEN category IS NOT NULL THEN category
                    WHEN species IN ('arabiensis', 'coluzzii', 'gambiae', 'gambiae_s form', 'gambiae/An. coluzzii', 'coluzzii_gambiae_m form', 'funestus') 
                    THEN 'Primary' 
                    ELSE 'Secondary' 
                END,
                color = CASE 
                    WHEN color IS NOT NULL THEN color
                    WHEN (category = 'Secondary' OR species NOT IN ('arabiensis', 'coluzzii', 'coluzzii_gambiae_m form', 'funestus', 'gambiae', 'gambiae_s form', 'gambiae/An. coluzzii', 'gambiae_s form_m form')) 
                    THEN '#038543'
                    ELSE '#252676' -- Simple default for existing primary
                END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS t_populate_recorded_species ON "recorded_species"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS populate_recorded_species`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "color"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "category"`);
        await queryRunner.query(`ALTER TABLE "recorded_species" DROP COLUMN IF EXISTS "display_name"`);
    }
}