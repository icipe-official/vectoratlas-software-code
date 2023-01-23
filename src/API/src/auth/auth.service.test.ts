import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('AuthService', () => {
  const OLD_ENV = process.env;
  let service: AuthService;
  let mockMailerService: Partial<MailerService>;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    process.env.ADMIN_EMAIL = 'test@recipient.com';
    await service.requestRoles(
      'Reason',
      ['admin', 'uploader'],
      'test@test',
      'id123',
    );
    expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Role request',
      to: 'test@recipient.com',
      html: `<div>
      <h2>Role Request</h2>
      <p>User test@test with id id123 has requested access to the following roles: admin, uploader. </p>
      <p>Reason given:</p>
      <b> Reason </b>
      <p>If this request is approved, please change the row in the 'user_role' table with auth0_id=id123.</p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      </div>`,
    });
  });
});
