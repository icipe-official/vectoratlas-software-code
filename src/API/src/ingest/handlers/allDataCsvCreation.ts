// import fs from 'fs';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';

// All dates UTC
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const flatten = require('flat')

function generateContent() {
  const lastIngest = {
    ingestion: {
      ingestTime: new Date(),
      isLocked: true,
    },
  };
  return JSON.stringify(lastIngest);
}

export function triggerAllDataCreationHandler() {
  fs.writeFileSync(`${process.cwd()}/../../lastIngest.json`, generateContent());
  console.log('Ingest Complete');
}

// const dbCsvMap = {
//   id: 'Initials',
//   reference_author: 'Author',
//   reference_year: 'Year',
//   reference_report_type: 'Report Type',
//   reference_published: 'Published',
//   reference_v_data: 'V Data',
//   site_country: 'Country',
//   site_name: 'Full Name',
//   site_admin_1: 'Admin 1 Paper',
//   site_admin_2: 'Admin 2 Paper',
//   site_admin_3: 'Admin 3 Paper',
//   site_admin_2_id: 'Admin 2 Id',
//   site_latitude: 'Latitude',
//   site_longitude: 'Longitude',
//   site_latitude_2: 'Latitude 2',
//   site_longitude_2: 'Longitude 2',
//   site_latlong_source: 'Lat Long Source',
//   site_good_guess: 'Good guess',
//   site_bad_guess: 'Bad guess',
//   site_site_notes: 'Site notes',
//   site_area_type: 'Area type',
//   site_rural_urban: 'Rural/Urban',
//   site_is_forest: 'Forest',
//   site_is_rice: 'Rice',
//   month_start: 'Month Start',
//   month_end: 'Month End',
//   year_start: 'Year Start',
//   year_end: 'Year End',
//   recordedSpecies_species_species: 'Species 1',
//   recordedSpecies_ss_sl: 's.s./s.l.',
//   recordedSpecies_assi: 'ASSI',
//   recordedSpecies_assi_notes: 'Notes ASSI',
//   /* sample_noDB1: 'Species 2', */ // ????????? Missing from DB but present test data
//   sample_mossamp_tech_1: 'Mossamp Tech 1',
//   sample_n_1: 'n1',
//   sample_mossamp_tech_2: 'Mossamp Tech 2',
//   sample_n_2: 'n2',
//   sample_mossamp_tech_3: 'Mossamp Tech 3',
//   sample_n_3: 'n3',
//   sample_mossamp_tech_4: 'Mossamp Tech 4',
//   sample_n_4: 'n4',
//   sample_n_all: 'All n',
//   /* sample_noDB2: 'All n check', */ // ??????? Missing from DB but present test data
//   recordedSpecies_id_method_1: 'MOS Id1',
//   recordedSpecies_id_method_2: 'MOS Id2',
//   recordedSpecies_id_method_3: 'MOS Id3',
//   recordedSpecies_id_method_4: 'MOS Id4',
//   sample_control: 'Control',
//   sample_control_type: 'Control Type',
//   dec_id: 'DEC Id',
//   dec_check: 'DEC Check',
//   map_check: 'Map Check',
//   vector_notes: 'Vector Notes',
// };

function arrayOfFlattenedObjects(array) {
  const csvArray = [];
  for (const i in array) {
    const flatObject = flatten(array[i], {
      delimiter: '_',
    });
    csvArray.push(flatObject);
  }
  return csvArray;
}

export async function createRepoCsv(
  repo: string,
  occurrenceDbdata?: Promise<Occurrence[]>,
  bionomicsDbData?: Promise<Bionomics[]>,
) {
  const data =
    repo === 'occurrence' ? await occurrenceDbdata : await bionomicsDbData;

  const dataflat = arrayOfFlattenedObjects(data);
  console.log(dataflat);
  (async () => {
    const csv = new ObjectsToCsv(dataflat);

    fs.writeFileSync(
      `${process.cwd()}/public/downloads/${repo}DownloadFile.csv`,
      await csv.toString(),
    );
  })();
  allDataCsv();
}

export async function allDataCsv() {
  // Need to know how we want to display all data
  return 'allData';
}

// Try catch mindful of quirky errors
