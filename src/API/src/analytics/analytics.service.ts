import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AnalyticsService {
  private umamiAuthToken: string;

  constructor(
    private logger: Logger,
    private http: HttpService
    ) {
    }

  // Need to handle scenario where token requires renewal
  async init(){
    const user = {
      "username": "admin",
      "password": process.env.ANALYTICS_ADMIN_PASSWORD,
    }
    this.umamiAuthToken = await lastValueFrom(this.http.post(`${process.env.ANALYTICS_API_URL}/auth/login`, user )
    .pipe(
      map((res: any) => {
        return res.data.token
      })
    ))
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
        console.log('events', events)
        return events
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
        return metrics
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
