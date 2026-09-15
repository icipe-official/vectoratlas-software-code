import { InputType, Field } from '@nestjs/graphql';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

@InputType()
export class UnsubscribeEmailDto {
  @Field() // 2. Add this to register the field in the schema
  @IsNotEmpty({ message: 'The account identifier is required to unsubscribe.' })
  @IsUUID('4', { message: 'Invalid account identifier format.' })
  id: string;

  @Field()
  @IsNotEmpty({ message: 'The security token is required to unsubscribe.' })
  @IsUUID('4', { message: 'Invalid security token format.' })
  token: string;

  @Field({ nullable: true })
  @IsString({ message: 'The reason must be text.' })
  @IsOptional()
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters.' })
  reason?: string;
}
