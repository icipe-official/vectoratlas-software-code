import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { EmailRegistry } from './entities/email-registry.entity';
import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';
import { AccountStatus } from './entities/email-registry.entity';

/**
 * Evaluates token windows against a strict 48-hour Time-To-Live validation boundary.
 */
const VERIFICATION_CODE_TTL_MS = 48 * 60 * 60 * 1000;

@Injectable()
export class EmailRegistryService {

    constructor(
        @InjectRepository(EmailRegistry)
        private readonly emailRegistryRepository: Repository<EmailRegistry>,
        private readonly emailService: EmailService
    ){}

    async subscribe(payload: SubscribeEmailDto): Promise<EmailRegistry> {
        const email = payload.email.trim().toLowerCase();
        const verificationToken = uuidv4();
        const unsubscriptionToken = uuidv4(); // Generate early so it is immediately ready
        const codeExpiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

        let entry = await this.emailRegistryRepository.findOne({ where: { email } });

        if (entry) {
            if (entry.account_status === AccountStatus.VERIFIED) {
                throw new BadRequestException('This email address is already actively subscribed.');
            }
            
            Object.assign(entry, {
                first_name: payload.first_name,
                last_name: payload.last_name,
                notifications_enabled: payload.notifications_enabled,
            });
        } else {
            entry = this.emailRegistryRepository.create({
                id: uuidv4(),
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: email,
                notifications_enabled: payload.notifications_enabled,
            });
        }

        entry.account_status = AccountStatus.PENDING_VERIFICATION;
        entry.verification_token = verificationToken;
        entry.token_expires_at = codeExpiresAt;
        entry.unsubscription_token = unsubscriptionToken; // Assign the secure token

        const savedEntry = await this.emailRegistryRepository.save(entry);

        const baseUrl =
            process.env.EMAIL_VERIFICATION_BASE_URL ??
            process.env.API_BASE_URL ??
            'http://localhost:3001';
        
        const verificationLink = new URL('/api/verify', baseUrl);
        verificationLink.searchParams.set('token', verificationToken);

        // Architectural Fix: Route lookup by Primary ID to optimize index tree traversal
        // Expose the unsubscription token as the tamper-proof access check vector
        const unsubscribeLink = new URL('/api/unsubscribe', baseUrl);
        unsubscribeLink.searchParams.set('id', savedEntry.id); 
        unsubscribeLink.searchParams.set('token', unsubscriptionToken);

        await this.emailService.sendEmail(
            [savedEntry.email],
            [],
            'Verify your email subscription',
            `
            <p>Thanks for subscribing to updates, ${savedEntry.first_name}.</p>
            <p>Please verify your email address by clicking this link:</p>
            <p><a href="${verificationLink.toString()}">${verificationLink.toString()}</a></p>
            <p>This verification link will expire in 48 hours.</p>
            <br/>
            <hr style="border: 0; border-top: 1px solid #eee;"/>
            <p style="font-size: 12px; color: #888888;">
                Received this by mistake? <a href="${unsubscribeLink.toString()}">Unsubscribe instantly here</a>.
            </p>
            `,
        );

        return savedEntry; 
    }

    async verify(query: VerifyTokenDto): Promise<EmailRegistry> {
        const trimmedToken = query.token?.trim();
        if (!trimmedToken) {
            throw new BadRequestException('Verification token parameter is missing from request.');
        }

        const entry = await this.emailRegistryRepository.findOne({
            where: { verification_token: trimmedToken },
        });

        if (!entry) {
            throw new NotFoundException('The verification token provided is invalid or has already been used.');
        }

        if (entry.token_expires_at && entry.token_expires_at.getTime() < Date.now()) {
            throw new BadRequestException('This verification link has expired. Please request a new subscription.');
        }

        entry.account_status = AccountStatus.VERIFIED;
        entry.verification_token = null;
        entry.token_expires_at = null;

        return await this.emailRegistryRepository.save(entry);
    }

    
    async unsubscribe(payload: UnsubscribeEmailDto): Promise<void> {
        const targetId = payload.id?.trim();
        const secureToken = payload.token?.trim();

        if (!targetId || !secureToken) {
            throw new BadRequestException('Required unsubscription identifiers are missing.');
        }
        
        
        const entry = await this.emailRegistryRepository.findOne({
            where: { id: targetId },
        });

        
        if (!entry || entry.unsubscription_token !== secureToken) {
            throw new NotFoundException('The unsubscription link is invalid or has already been processed.');
        }

    
        entry.account_status = AccountStatus.UNSUBSCRIBED;
        entry.notifications_enabled = false;
        
        
        entry.unsubscription_token = null;

        await this.emailRegistryRepository.save(entry);
    }
}

