import { Controller, Get,  Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatasetService } from './dataset.service';
import { Dataset } from './entities/dataset.entity';
import * as flat from 'flat';

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
let isPrimitive = (val) => {
   
  if(val === null){
      return true
  }
   
  if(typeof val == "object" || typeof val == "function"){
       return false
  }else{
    return true
  }
}
 
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object') {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}
function convertToCSV(objects: object[]): string {
  let headerKeys: string[] | undefined;
  
  function getCSVHeader(obj: object, parentKey?: string): string {
    return Object.keys(obj).map(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];
      if (value === undefined || value === null) {
        return '';
      }
      if (typeof value === 'object' && value !== null) {
        return getCSVHeader(value, fullKey);
      }
      if (!headerKeys) {
        headerKeys = [];
      }
      headerKeys.push(fullKey);
      return fullKey;
    }).join(',');
  }
  
  function getCSVRow(obj: object): string {
    return Object.entries(obj).map(([key, value]) => {
      if (value === undefined || value === null) {
        return '';
      }
      if (typeof value === 'object' && value !== null) {
        return getCSVRow(value);
      }
      const columnIndex = headerKeys ? headerKeys.indexOf(key) : -1;
      return columnIndex >= 0 ? String(value) : ',' + String(value);
    }).join('') + '\n';
  }
  
  const header = getCSVHeader(objects[0]);
  const body = objects.map(getCSVRow).join('');
  
  return header + body;
}
export function arrayOfFlattenedObjects(array) {
  const csvArray = [];
  for (const i in array) {
    const flatObject = flat.flatten(array[i], {
      delimiter: '_',
    });
    csvArray.push(flatObject);
  }
  return csvArray;
}




@Controller('dataset')
export class DatasetController {
    constructor(private datasetService: DatasetService) {}


    @Get('/:datasetid')
    async  getDataSetByid(@Param('datasetid') datasetid: string,@Res() res: Response) :Promise<any> {

         try {

              const data = await this.datasetService.findOneByIdWithChildren(datasetid)
              
              if(data.bionomics.length>0){
                res.contentType('text/csv');
                res.status(200).send(arrayToCSV( arrayOfFlattenedObjects( data.bionomics)));
            }else if(data.occurrence.length>0){
              res.contentType('text/json');
              res.status(200).send(arrayToCSV( arrayOfFlattenedObjects( data.occurrence)));
              ;
            }else{     
              res.contentType('text/plain');
              res.status(404).send("Dataset with specified id does not exist")}



              

          } catch (e: any) {
           return e.response
          }
    }
    }
