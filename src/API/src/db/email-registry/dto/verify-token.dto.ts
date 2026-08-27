import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsString({ message: 'The verification token must be a text string.' })
  @IsNotEmpty({ message: 'Verification token is missing from the URL.' })
  token: string;
}
