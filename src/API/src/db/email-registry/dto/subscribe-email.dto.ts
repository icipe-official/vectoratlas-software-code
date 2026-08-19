import { IsEmail, IsString, IsBoolean } from 'class-validator';

export class SubscribeEmailDto {

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email:string;

    @IsBoolean()
    notifications_enabled: boolean;
}