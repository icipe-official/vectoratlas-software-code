import { IsEmail, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class SubscribeEmailDto {

    @IsString({ message: 'First name must be a text value.' })
    @IsNotEmpty({ message: 'First name cannot be left blank.' })
    first_name: string;

    @IsString({ message: 'Last name must be a text value.' })
    @IsNotEmpty({ message: 'Last name cannot be left blank.' })
    last_name: string;

    @IsEmail({}, { message: 'Please enter a valid email address.' })
    @IsNotEmpty({ message: 'Email address is required.' })
    email: string;

    @IsBoolean({ message: 'Notifications enabled must be a true or false value.' })
    // Note: No @IsNotEmpty needed here, as false is a valid boolean value
    notifications_enabled: boolean;
}
