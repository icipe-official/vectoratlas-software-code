/* eslint-disable max-len*/
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Repository } from 'typeorm';

export const getUmamiToken = async (http: HttpService) => {
  const user = {
    username: 'admin',
    password: process.env.ANALYTICS_ADMIN_PASSWORD,
  };
  const token = await lastValueFrom(
    http.post(`${process.env.ANALYTICS_API_URL}/auth/login`, user).pipe(
      map((res: any) => {
        return res.data.token;
      }),
    ),
  );
  return token;
};

@Injectable()
export class AnalyticsService {
  private umamiAuthToken: string;
  private umamiWebsiteUUID: string;

  constructor(
    private logger: Logger,
    private http: HttpService,
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
  ) {}

  async init() {
    this.umamiAuthToken = await getUmamiToken(this.http);
    this.umamiWebsiteUUID = process.env.NEXT_PUBLIC_ANALYTICS_ID
  }

  async eventAnalytics(
    startAt: number,
    endAt: number,
    unit: string,
    timezone: string,
  ) {
    try {
      const events = await lastValueFrom(
        this.http
          .get(
            `${process.env.ANALYTICS_API_URL}/websites/${this.umamiWebsiteUUID}/events?start_at=${startAt}&end_at=${endAt}&unit=${unit}&tz=${timezone}`,
            { headers: { Authorization: `Bearer ${this.umamiAuthToken}` } },
          )
          .pipe(
            map((res: any) => {
              return res.data;
            }),
          ),
      );
      let downloadFilteredButtonEvent = 0;
      events.map((event: { x: string; y: number }) =>
        event.x === 'download-filtered'
          ? (downloadFilteredButtonEvent += event.y)
          : '',
      );
      return downloadFilteredButtonEvent;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async statsAnalytics(startAt: number, endAt: number) {
    try {
      const pageViews = await lastValueFrom(
        this.http
          .get(
            `${process.env.ANALYTICS_API_URL}/websites/${this.umamiWebsiteUUID}/stats?start_at=${startAt}&end_at=${endAt}`,
            { headers: { Authorization: `Bearer ${this.umamiAuthToken}` } },
          )
          .pipe(
            map((res: any) => {
              return res.data;
            }),
          ),
      );
      return pageViews;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async metricsAnalytics(startAt: number, endAt: number, type: string) {
    try {
      const metrics = await lastValueFrom(
        this.http
          .get(
            `${process.env.ANALYTICS_API_URL}/websites/${this.umamiWebsiteUUID}/metrics?start_at=${startAt}&end_at=${endAt}&type=${type}`,
            { headers: { Authorization: `Bearer ${this.umamiAuthToken}` } },
          )
          .pipe(
            map((res: any) => {
              return res.data;
            }),
          ),
      );
      const numberCountries = metrics.length;
      return numberCountries;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async recordsAnalytics() {
    try {
      const approvedRecords = await this.occurrenceRepository
        .createQueryBuilder('occurrence')
        .leftJoin('occurrence.dataset', 'dataset')
        .where('dataset.status = :status', { status: 'Approved' })
        .getRawMany();
      return approvedRecords.length;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
