import { Controller, Get } from '@nestjs/common';
import * as geoJSON from './geoJSON/geoJSON.json';
import type { GeoJsonObject } from 'geojson';

@Controller('data')
export class DataController {
    @Get('countryBorders')
    findAll(): GeoJsonObject {
        return geoJSON as GeoJsonObject;
    }
}
