import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailRegistryService } from './email-registry.service';

@Processor('subscription-queue')
@Injectable()
export class SubscriptionProcessor extends WorkerHost {
  private readonly logger = new Logger(SubscriptionProcessor.name);

  constructor(private readonly emailRegistryService: EmailRegistryService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    // this.logger.log(`Starting background job ${job.id}:${job.name}`);

    if (job.name === 'clean-expired-subscribers') {
      try {
        // Progress logging in frontend
        await job.updateProgress(10);

        const deletedCount =
          await this.emailRegistryService.hardDeleteInactiveSubscribers();

        await job.updateProgress(100);
        //this.logger.log(`Job ${job.id} completed successfully. Deleted ${deletedCount}`);

        return { success: true, recordsDeleted: deletedCount };
      } catch (error) {
        this.logger.error(`Job ${job.id} failed`, error);
        throw error;
      }
    }
  }
}
