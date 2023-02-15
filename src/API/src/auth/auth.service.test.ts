import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, getAuth0Token } from './auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { MockType } from 'src/mocks';
import * as rxjs from 'rxjs';
import { UserRoleService } from './user_role/user_role.service';

jest.mock('@nestjs/axios', () => ({
  HttpService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('AuthService', () => {
  const OLD_ENV = process.env;
  let service: AuthService;
  let httpClient: MockType<HttpService>;
  let mockMailerService: Partial<MailerService>;
  let mockUserRoleService: Partial<UserRoleService>;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: jest.fn(),
    };
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockUserRoleService = {
      findByRole: jest
        .fn()
        .mockResolvedValue([{ auth0_id: 'id123' }, { auth0_id: 'id456' }]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: HttpService,
          useValue: httpClient,
        },
        {
          provide: UserRoleService,
          useValue: mockUserRoleService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest
      .spyOn(httpClient, 'post')
      .mockImplementationOnce(() =>
        rxjs.of({ data: { access_token: 'testtoken', email: 'testemail' } }),
      );

    jest
      .spyOn(httpClient, 'get')
      .mockImplementation(() =>
        rxjs.of({ data: { access_token: 'testtoken', email: 'email' } }),
      );

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAuth0Token should return a token', async () => {
    expect(await getAuth0Token(httpClient as unknown as HttpService)).toEqual(
      'testtoken',
    );
  });

  it('should send off a post request, from within getAuth0 token', async () => {
    await getAuth0Token(httpClient as unknown as HttpService);
    expect(httpClient.post).toHaveBeenCalledWith(
      'https://dev-326tk4zu.us.auth0.com/oauth/token',
      expect.anything(),
      expect.anything(),
    );
  });

  it('requestRoles should send email', async () => {
    await service.requestRoles(
      'Reason',
      ['admin', 'uploader'],
      'test@test',
      'id123',
    );
    expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Role request',
      to: ['email', 'email'],
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

  describe('getRoleEmails', () => {
    it('should call the right methods', async () => {
      const emails = await service.getRoleEmails('admin');
      expect(emails).toEqual(['email', 'email']);
      expect(mockUserRoleService.findByRole).toHaveBeenCalledWith('admin');
    });
  });

  describe('getAllUsers', () => {
    it('should request the list of users from auth0', async () => {
      httpClient.get.mockImplementation(() =>
        rxjs.of({ data: ["mock user response"] }),
      );

      const users = await service.getAllUsers();

      expect(users).toEqual(["mock user response"]);
      expect(httpClient.get).toHaveBeenCalledWith('https://dev-326tk4zu.us.auth0.com/api/v2/users', expect.anything())
    });
  })
});
