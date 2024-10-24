import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { UserRoleService } from './user_role/user_role.service';
import { EmailService } from 'src/email/email.service';

const tokenExpiry = (token) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000;

const isTokenCloseToExpiry = (token) => {
  // check if it expires in the next hour
  return Date.now() + 60 * 60 * 1000 >= tokenExpiry(token);
};

let auth0Token;

export const getAuth0Token = async (http: HttpService) => {
  const token = await lastValueFrom(
    http
      .post(
        process.env.AUTH0_ISSUER_URL + 'oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_ISSUER_URL + 'api/v2/',
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      )
      .pipe(
        map((res: any) => {
          return res.data.access_token;
        }),
      ),
  );
  return token;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: EmailService,
    private readonly httpService: HttpService,
    private readonly userRoleService: UserRoleService,
  ) { }

  async init() {
    if (!auth0Token || isTokenCloseToExpiry(auth0Token)) {
      auth0Token = await getAuth0Token(this.httpService);
    }
  }

  async getEmailFromUserId(userId: string): Promise<string> {
    return lastValueFrom(
      this.httpService
        .get(`${process.env.AUTH0_ISSUER_URL}api/v2/users/${userId}`, {
          headers: {
            authorization: `Bearer ${auth0Token}`,
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        })
        .pipe(
          map((res: any) => {
            return res.data.email;
          }),
        ),
    );
  }

  async getUserDetailsFromId(userId: string): Promise<string> {
    return lastValueFrom(
      this.httpService
        .get(`${process.env.AUTH0_ISSUER_URL}api/v2/users/${userId}`, {
          headers: {
            authorization: `Bearer ${auth0Token}`,
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        })
        .pipe(
          map((res: any) => {
            return res.data;
          }),
        ),
    );
  }

  async getRoleEmails(role: string) {
    const userList = await this.userRoleService.findByRole(role);
    if (userList) {
      return Promise.all(
        userList.map(
          async (item) => await this.getEmailFromUserId(item.auth0_id),
        ),
      );
    }
    return await [];
  }

  async getAllUsers() {
    return lastValueFrom(
      this.httpService
        .get(`${process.env.AUTH0_ISSUER_URL}api/v2/users`, {
          headers: {
            Authorization: `Bearer ${auth0Token}`,
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        })
        .pipe(
          map((res: any) => {
            return res.data;
          }),
        ),
    );
  }

  async requestRoles(
    requestReason,
    rolesRequested,
    email,
    userId,
  ): Promise<boolean> {
    try {
      const requestHtml = `<div>
      <h2>Role Request</h2>
      <p>User ${email} with id ${userId} has requested access to the following roles: ${rolesRequested.join(
        ', ',
      )}. </p>
      <p>Reason given:</p>
      <b> ${requestReason} </b>
      <p>If this request is approved, please change the row in the 'user_role' table with auth0_id=${userId}.</p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      </div>`;
      await this.init();
      const adminEmails = await this.getRoleEmails('admin');

      // await this.mailerService.sendEmail(
      //   adminEmails,
      //   [],
      //   'Role request',
      //   requestHtml,
      //   [],
      //   null,
      // );

      await this.mailerService.sendEmail(
        adminEmails,
        [],
        'Role request',
        requestHtml,
      );

      // this.mailerService
      //   .sendMail({
      //     to: adminEmails,
      //     from: 'vectoratlas-donotreply@icipe.org',
      //     subject: 'Role request',
      //     html: requestHtml,
      //   })
      //   .then(() => {
      //     return true;
      //   })
      //   .catch((err) => {
      //     throw err;
      //   });
      return true;
    } catch {
      return false;
    }
  }
}
