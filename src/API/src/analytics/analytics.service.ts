import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Repository } from 'typeorm';

const user = {
  "username": "admin",
  "password": process.env.ANALYTICS_ADMIN_PASSWORD,
}

export const getUmamiToken = async (http: HttpService) => {
  const token = await lastValueFrom(http.post(`${process.env.ANALYTICS_API_URL}/auth/login`, user )
    .pipe(
      map((res: any) => {
        return res.data.token
      })
    ))
  return token
}

 // Still need to handle scenario where token requires renewal
@Injectable()
export class AnalyticsService {
  private umamiAuthToken: string;

  constructor(
    private logger: Logger,
    private http: HttpService,
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
    ) {
    }

  async init(){
    this.umamiAuthToken = await getUmamiToken(this.http)
  }

  async eventAnalytics(startAt: number, endAt: number, unit: string, timezone: string) {
    try {
      const events = await lastValueFrom(this.http
        .get(`${process.env.ANALYTICS_API_URL}/websites/${process.env.NEXT_PUBLIC_ANALYTICS_ID}/events?start_at=${startAt}&end_at=${endAt}&unit=${unit}&tz=${timezone}`,
        {headers: {'Authorization': `Bearer ${this.umamiAuthToken}`}
        })  
          .pipe(
            map((res:any) => {
              return res.data
            })
          )
        )
        let downloadFilteredButtonEvent = 0
        events.map((event: { x: string; y: number; })=> event.x === 'download-filtered' ? downloadFilteredButtonEvent+=event.y : '')
        return downloadFilteredButtonEvent
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async statsAnalytics(startAt: number, endAt: number) {
    try {
      const pageViews = await lastValueFrom(this.http
        .get(`${process.env.ANALYTICS_API_URL}/websites/${process.env.NEXT_PUBLIC_ANALYTICS_ID}/stats?start_at=${startAt}&end_at=${endAt}`,
        {headers: {'Authorization': `Bearer ${this.umamiAuthToken}`}
        })
          .pipe(
            map((res:any) => {
              return res.data
            })
          )
        )
        return pageViews
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async metricsAnalytics(startAt: number, endAt: number, type: string) {  
    try {
      const metrics = await lastValueFrom(this.http
        .get(`${process.env.ANALYTICS_API_URL}/websites/${process.env.NEXT_PUBLIC_ANALYTICS_ID}/metrics?start_at=${startAt}&end_at=${endAt}&type=${type}`,
        {headers: {'Authorization': `Bearer ${this.umamiAuthToken}`}
        })
          .pipe(
            map((res:any) => {
              return res.data
            })
          )
        )
        const numberCountries = metrics.length
        return numberCountries
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async recordsAnalytics() {
    try {
      const recordDownloads = await this.occurrenceRepository
        .createQueryBuilder("occurrence")
        .select("occurrence.id")
        .addSelect("occurrence.download_count", "downloads")
        .groupBy("occurrence.id")
        .getRawMany()
      const approvedRecords = await this.occurrenceRepository
        .createQueryBuilder("occurrence")
        .leftJoin("occurrence.dataset", "dataset")
        .where("dataset.status = :status", {status:"Approved"})
        .getRawMany()
      let totalRecordDownloads = 0;
      recordDownloads.map((occurrence) => totalRecordDownloads += occurrence.downloads)
      return {recordsDownloaded:totalRecordDownloads, recordsTotal:approvedRecords.length}
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
