import { Logger, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { HttpModule } from '@nestjs/axios';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([
            Occurrence
          ])
    ],
    providers: [
        AnalyticsService,
        AnalyticsResolver,
        Logger,
    ],
    exports: [],
})
export class AnalyticsModule {}
