import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailRegistryService } from './email-registry.service';
import { EmailService } from 'src/email/email.service';
import { EmailRegistry } from './entities/email-registry.entity';

describe('EmailRegistryService - Campaigns', () => {
  let service: EmailRegistryService;
  let emailService: jest.Mocked<EmailService>;
  let repo: jest.Mocked<Repository<EmailRegistry>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailRegistryService,
        {
          provide: EmailService,
          useValue: { sendEmail: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: getRepositoryToken(EmailRegistry),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(EmailRegistryService);
    emailService = module.get(EmailService);
    repo = module.get(getRepositoryToken(EmailRegistry));
  });

  it('queueNewsCampaign: compiles green template and sends only to verified subscribers', async () => {
    const subscriber = {
      id: 'usr-1',
      email: 'alice@test.com',
      first_name: 'Alice',
      last_name: 'Smith',
      unsubscription_token: 'tok-abc',
    } as EmailRegistry;

    // Mock the query builder chain used by streamVerified()
    const mockQb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValueOnce([subscriber]) // first chunk has our user
        .mockResolvedValueOnce([]), // second chunk is empty → stream ends
    };
    repo.createQueryBuilder.mockReturnValue(mockQb as any);

    const result = await service.queueNewsCampaign(
      'August Newsletter',
      'Check out the new map overlays.',
      'https://vectoratlas.org/news/august-update',
    );

    expect(result.sent).toBe(1);
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1);

    const [recipients, , subject, html] = emailService.sendEmail.mock.calls[0];
    expect(recipients).toEqual(['alice@test.com']);
    expect(subject).toBe('August Newsletter');
    expect(html).toContain('Hello Alice');
    expect(html).toContain('Check out the new map overlays.');
    expect(html).toContain('https://vectoratlas.org/news/august-update');
    expect(html).toContain('tok-abc'); // unsubscribe token injected
    expect(html).toContain('Read Full Story'); // green CTA present
    expect(html).toContain('background: linear-gradient'); // green header
  });

  it('queueNewsCampaign: returns 0 when no verified subscribers exist', async () => {
    const mockQb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    repo.createQueryBuilder.mockReturnValue(mockQb as any);

    const result = await service.queueNewsCampaign('Test', 'Test msg');
    expect(result.sent).toBe(0);
    expect(emailService.sendEmail).not.toHaveBeenCalled();
  });

  it('queueNewsCampaign: renders correctly without a newsUrl (no CTA button)', async () => {
    const subscriber = {
      id: 'usr-2',
      email: 'bob@test.com',
      first_name: 'Bob',
      last_name: 'Jones',
      unsubscription_token: 'tok-xyz',
    } as EmailRegistry;

    const mockQb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValueOnce([subscriber])
        .mockResolvedValueOnce([]),
    };
    repo.createQueryBuilder.mockReturnValue(mockQb as any);

    const result = await service.queueNewsCampaign(
      'Quick Update',
      'Just a short message.',
      undefined, // no URL
    );

    expect(result.sent).toBe(1);
    const [, , , html] = emailService.sendEmail.mock.calls[0];
    expect(html).toContain('Just a short message.');
    expect(html).not.toContain('Read Full Story'); // CTA absent when no URL
    expect(html).toContain('tok-xyz');
  });
});
