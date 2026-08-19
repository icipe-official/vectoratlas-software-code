import { IsEmail, IsString } from 'class-validator';

export class SubscribeEmailDto {

    @IsString()
    first_name: string;
    last_name: string;

    @IsEmail()
    email:string;
}