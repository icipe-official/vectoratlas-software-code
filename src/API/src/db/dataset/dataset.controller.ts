import { Controller, Get,  Param, Res } from '@nestjs/common';
import { Response } from 'express';
;

const flattenObj = (ob:Object) => {
 
  // The object which contains the
  // final result
  let result = {};

  // loop through the object "ob"
  for (const i in ob) {

      // We check the type of the i using
      // typeof() function and recursively
      // call the function again
      if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
          const temp = flattenObj(ob[i]);
          for (const j in temp) {

              // Store temp in result
              result[i + '.' + j] = temp[j];
          }
      }

      // Else store ob[i] in result directly
      else {
          result[i] = ob[i];
      }
  }
  return result;
};

function arrayToCSV (data:Array<Object>) {
  const csv = data.map(row => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
}
@Controller('dataset')
export class DatasetController {

    @Get('/:datasetid')
    async  getDataSetByid(@Param('datasetid') datasetid: string,@Res() res: Response) :Promise<any> {

         try {

         return fetch("http://localhost:3001/graphql",{
                method:'POST',
                headers:{"content-Type":"application/json"},
                body:JSON.stringify({
                  query:` 
                  query( $datasetid: String!){
                    bionomicsDataSet(id: $datasetid) {
                      bionomics {
                        adult_data
                        contact_authors
                        contact_notes
                        control
                        control_notes
                        data_abstracted_by
                        data_checked_by
                        #  dataset
                        id
                        insecticide_control
                        itn_use
                        larval_site_data
                        month_end
                        month_start
                        season_calc
                        season_given
                        season_notes
                        secondary_info
                        study_sampling_design
                        timestamp_end
                        timestamp_start
                        year_end
                        year_start
                      }
                    }
                    occurrenceDataSet(id: $datasetid) {
                      occurrence {
                        #bionomics
                        dec_check
                        dec_id
                        id
                        map_check
                        month_end
                        month_start
                        recorded_species {
                          assi
                          assi_notes
                          id
                          id_method_1
                          id_method_2
                          id_method_3
                          species
                          species_notes
                          ss_sl
                        }
                        reference {
                          article_title
                          author
                          citation
                          id
                          journal_title
                          num_id
                          published
                          report_type
                          v_data
                          year
                        }
                        sample {
                          control
                          control_type
                          id
                          mossamp_tech_1
                          mossamp_tech_2
                          mossamp_tech_3
                          mossamp_tech_4
                          n_1
                          n_2
                          n_3
                          n_4
                          n_all
                        }
                        site {
                          admin_1
                          admin_2
                          admin_2_id
                          admin_3
                          admin_level
                          area_type
                          bad_guess
                          country
                          gaul_code
                          georef_notes
                          georef_source
                          good_guess
                          id
                          is_forest
                          is_rice
                          latitude
                          latitude_2
                          latlong_source
                          location
                          location_2
                          longitude
                          longitude_2
                          map_site
                          name
                          rural_urban
                          site_notes
                        }
                  
                        timestamp_end
                        timestamp_start
                        vector_notes
                        year_end
                        year_start
                      }
                    }
                  }`,
                  variables:{datasetid}
                
                })
              }).then(res=>res.json())
              .then(data=>{
                console.log((data.data.bionomicsDataSet) )
                var returnCsv
              if(data.data.bionomicsDataSet[0].bionomics.length>0){
                  returnCsv = arrayToCSV(data.data.bionomicsDataSet[0].bionomics);
              }else if(data.data.occurrenceDataSet[0].occurrence>0)
              {
                returnCsv=arrayToCSV(data.data.occurrenceDataSet[0].occurrence.map(currentObj=>(flattenObj(currentObj))));
              }                else{res.status(404).send("Dataset with specified id does not exist")}


              

                //return(csvFile)
                res.contentType('text/csv');
                res.status(200).send(returnCsv)                


              })

          } catch (e: any) {
           return e.response.data
          }
    }
    }
