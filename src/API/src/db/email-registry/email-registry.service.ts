import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { EmailRegistry } from './entities/email-registry.entity';
import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';
import { AccountStatus } from './entities/email-registry.entity';
import { ILike } from 'typeorm';
import * as ExcelJS from 'exceljs';

/**
 * Evaluates token windows against a strict 48-hour Time-To-Live validation boundary.
 */
const VERIFICATION_CODE_TTL_MS = 48 * 60 * 60 * 1000;

@Injectable()
export class EmailRegistryService {
  constructor(
    @InjectRepository(EmailRegistry)
    private readonly emailRegistryRepository: Repository<EmailRegistry>,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(payload: SubscribeEmailDto): Promise<EmailRegistry> {
    const email = payload.email.trim().toLowerCase();
    const verificationToken = uuidv4();
    const unsubscriptionToken = uuidv4(); // Generate early so it is immediately ready
    const codeExpiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    let entry = await this.emailRegistryRepository.findOne({
      where: { email },
    });

    if (entry) {
      if (entry.account_status === AccountStatus.VERIFIED) {
        throw new BadRequestException(
          'This email address is already actively subscribed.',
        );
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

    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL?.trim() || 'http://localhost:3000';

    const verificationLink = new URL('/verify-success', frontendBaseUrl);
    verificationLink.searchParams.set('token', verificationToken);

    // Architectural Fix: Route lookup by Primary ID to optimize index tree traversal
    // Expose the unsubscription token as the tamper-proof access check vector
    const unsubscribeLink = new URL('/unsubscribed-success', frontendBaseUrl);
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
      throw new BadRequestException(
        'Verification token parameter is missing from request.',
      );
    }

    const entry = await this.emailRegistryRepository.findOne({
      where: { verification_token: trimmedToken },
    });

    if (!entry) {
      throw new NotFoundException(
        'The verification token provided is invalid or has already been used.',
      );
    }

    if (
      entry.token_expires_at &&
      entry.token_expires_at.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'This verification link has expired. Please request a new subscription.',
      );
    }

    entry.account_status = AccountStatus.VERIFIED;
    entry.verification_token = uuidv4();
    entry.token_expires_at = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    return await this.emailRegistryRepository.save(entry);
  }

  async unsubscribe(payload: UnsubscribeEmailDto): Promise<void> {
    const targetId = payload.id?.trim();
    const secureToken = payload.token?.trim();

    if (!targetId || !secureToken) {
      throw new BadRequestException(
        'Required unsubscription identifiers are missing.',
      );
    }

    const entry = await this.emailRegistryRepository.findOne({
      where: { id: targetId },
    });

    if (!entry || entry.unsubscription_token !== secureToken) {
      throw new NotFoundException(
        'The unsubscription link is invalid or has already been processed.',
      );
    }

    entry.account_status = AccountStatus.UNSUBSCRIBED;
    entry.notifications_enabled = false;

    entry.unsubscription_token = uuidv4();

    await this.emailRegistryRepository.save(entry);
  }

  private async *streamVerified() {
    const chunkSize = 500;
    let lastId: string | null = null;

    while (true) {
      const qb = this.emailRegistryRepository
        .createQueryBuilder('er')
        .where('er.account_status = :status', {
          status: AccountStatus.VERIFIED,
        })
        .andWhere('er.notifications_enabled = :enabled', { enabled: true })
        .orderBy('er.id', 'ASC')
        .take(chunkSize);

      if (lastId) {
        qb.andWhere('er.id > :lastId', { lastId });
      }

      const rows = await qb.getMany();
      if (rows.length === 0) break;

      for (const row of rows) {
        yield row; // "yield" means: pause here, give this row to the caller, resume later
      }

      lastId = rows[rows.length - 1].id;
    }
  }
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) where.email = ILike(`%${search}%`);
    if (status && status !== 'all') where.account_status = status;

    const [data, total] = await this.emailRegistryRepository.findAndCount({
      where,
      order: { token_expires_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createManual(dto: {
    email: string;
    first_name?: string;
    last_name?: string;
  }) {
    const email = dto.email.trim().toLowerCase();

    const exists = await this.emailRegistryRepository.findOne({
      where: { email },
    });
    if (exists) {
      throw new BadRequestException('Email already exists in registry.');
    }

    const record = this.emailRegistryRepository.create({
      id: uuidv4(),
      email,
      first_name: dto.first_name || '',
      last_name: dto.last_name || '',
      account_status: AccountStatus.VERIFIED,
      notifications_enabled: true,
      verification_token: uuidv4(),
      token_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
      unsubscription_token: uuidv4(),
    });

    return this.emailRegistryRepository.save(record);
  }

  async exportExcel(res: any) {
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
    });

    const ws = workbook.addWorksheet('Email Registry');
    ws.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'First Name', key: 'first_name', width: 20 },
      { header: 'Last Name', key: 'last_name', width: 20 },
      { header: 'Status', key: 'account_status', width: 20 },
      { header: 'Notifications', key: 'notifications_enabled', width: 18 },
      { header: 'Token Expires', key: 'token_expires_at', width: 25 },
    ];

    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' },
    };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=email-registry.xlsx',
    );

    // Stream rows in chunks
    const batchSize = 1000;
    let lastId: string | null = null;

    while (true) {
      const qb = this.emailRegistryRepository
        .createQueryBuilder('er')
        .orderBy('er.id', 'ASC')
        .take(batchSize);

      if (lastId) qb.where('er.id > :lastId', { lastId });

      const rows = await qb.getMany();
      if (rows.length === 0) break;

      for (const r of rows) {
        ws.addRow({
          id: r.id,
          email: r.email,
          first_name: r.first_name || '',
          last_name: r.last_name || '',
          account_status: r.account_status,
          notifications_enabled: r.notifications_enabled ? 'Yes' : 'No',
          token_expires_at: r.token_expires_at?.toISOString() || '',
        }).commit();
      }

      lastId = rows[rows.length - 1].id;
    }

    await ws.commit();
    await workbook.commit();
  }

  private compileDatasetTemplate(
    title: string,
    message: string,
    datasetUrl: string,
    unsubscribeUrl: string,
    firstName?: string,
  ): string {
    return `<!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
            body { font-family: system-ui, sans-serif; color: #1f2937; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; }
            .header { background: #2563EB; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; }
            .btn { display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { text-align: center; padding: 24px; font-size: 12px; color: #6b7280; }
        </style>
        </head>
        <body>
        <div class="header"><h1 style="margin:0">Vector Atlas</h1></div>
        <div class="content">
            <h2>${title}</h2>
            <p>Hello ${firstName || 'there'},</p>
            <p>${message}</p>
            <a href="${datasetUrl}" class="btn">View Dataset</a>
        </div>
        <div class="footer">
            <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
        </div>
        </body>
        </html>`;
  }

  async queueDatasetCampaign(
    title: string,
    message: string,
    datasetUrl: string,
  ) {
    let count = 0;
    const baseUrl =
      process.env.FRONTEND_BASE_URL?.trim() || 'http://localhost:3000';

    for await (const record of this.streamVerified()) {
      const html = this.compileDatasetTemplate(
        title,
        message,
        datasetUrl,
        `${baseUrl}/unsubscribe?id=${record.id}&token=${record.unsubscription_token}`,
        record.first_name,
      );

      await this.emailService.sendEmail([record.email], [], title, html);
      count++;

      // THROTTLE: 5 emails per second to respect SMTP limits
      if (count % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return { sent: count };
  }

  private compileNewsTemplate(
    title: string,
    message: string,
    newsUrl: string | undefined,
    unsubscribeUrl: string,
    firstName?: string,
  ): string {
    const ctaButton = newsUrl
      ? `<a href="${newsUrl}" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:6px;margin-top:16px;font-weight:600;">Read Full Story</a>`
      : '';

    return `<!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; background: #f3f4f6; }
                .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 32px 24px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                .content { padding: 32px 24px; }
                .content h2 { margin-top: 0; color: #065f46; font-size: 20px; }
                .content p { margin: 16px 0; color: #374151; }
                .footer { text-align: center; padding: 24px; font-size: 12px; color: #6b7280; background: #f9fafb; border-top: 1px solid #e5e7eb; }
                .footer a { color: #059669; }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header"><h1>Vector Atlas</h1></div>
                <div class="content">
                    <h2>${title}</h2>
                    <p>Hello ${firstName || 'there'},</p>
                    <p>${message}</p>
                    ${ctaButton}
                </div>
                <div class="footer">
                    <p>You're receiving this because you subscribed to Vector Atlas updates.</p>
                    <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
                </div>
            </div>
            </body>
            </html>`;
  }

  async queueNewsCampaign(title: string, message: string, newsUrl?: string) {
    let count = 0;
    const baseUrl =
      process.env.FRONTEND_BASE_URL?.trim() || 'http://localhost:3000';

    for await (const record of this.streamVerified()) {
      const html = this.compileNewsTemplate(
        title,
        message,
        newsUrl,
        `${baseUrl}/unsubscribe?id=${record.id}&token=${record.unsubscription_token}`,
        record.first_name,
      );

      await this.emailService.sendEmail([record.email], [], title, html);
      count++;

      if (count % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return { sent: count };
  }
}
