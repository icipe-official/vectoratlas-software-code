import { ObjectType, Field, registerEnumType  } from "@nestjs/graphql";
// import { BaseEntityExtended } from "../../base.entity.extended";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IsEnum } from "class-validator";

export enum AccountStatus {
    PENDING_VERIFICATION = 'pending_verification',
    VERIFIED = 'verified',
    DEACTIVATED = 'deactivated',
    UNSUBSCRIBED = 'unsubscribed',
}
registerEnumType(AccountStatus, {
    name: 'AccountStatus', 
    description: 'The current verification or activity state of the email registry account.',
});


@Entity('email_registry')
@ObjectType({ description: 'Email Registry'})

//data model to store email registry information. This will be used to send emails to users for various events

export class EmailRegistry{

    @Field(() => String)
    @PrimaryColumn()
    id: string;

    @Field(() => String)
    @Column()
    first_name: string;

    @Field(() => String)
    @Column()
    last_name: string;

    @Field(() => String)
    @Column({ unique: true , nullable: false})
    email: string;

    @Field(() => AccountStatus)
    @Column({default: 'pending_verification'})
    @IsEnum(AccountStatus)
    account_status: AccountStatus;

    @Field()
    @Column({default: true})
    notifications_enabled: boolean;

    @Field()
    @Column()
    verification_token: string;

    @Field(() => Date)
    @Column({nullable: false, type: 'timestamp'})
    token_expires_at: Date;

    @Field()
    @Column({nullable: true})
    unsubscription_token: string;

}


