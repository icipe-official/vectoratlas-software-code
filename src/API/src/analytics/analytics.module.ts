import { Logger, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule
    ],
    providers: [
    AnalyticsService,
    AnalyticsResolver,
    Logger,
    ],
    exports: [],
})
export class AnalyticsModule {}
