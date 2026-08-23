import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UnsubscribeEmailDto {
  @IsNotEmpty({ message: 'The account identifier is required to unsubscribe.' })
  @IsUUID('4', { message: 'Invalid account identifier format.' })
  id: string; // Used for ultra-fast Primary Key database lookup

  @IsNotEmpty({ message: 'The security token is required to unsubscribe.' })
  @IsUUID('4', { message: 'Invalid security token format.' })
  token: string; // Used to prove ownership and prevent URL tampering

  @IsString({ message: 'The reason must be text.' })
  @IsOptional()
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters.' })
  reason?: string; // Kept your optional feedback field intact
}
