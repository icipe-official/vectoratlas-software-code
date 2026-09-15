import { Expose } from 'class-transformer';

export class SubscriptionResponseDto {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  notifications_enabled: boolean;

  @Expose()
  account_status: string;

  @Expose()
  created_at?: Date;
}
