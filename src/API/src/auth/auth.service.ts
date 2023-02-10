import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

export const getAuth0Token = async (http: HttpService) => {
  const token = await lastValueFrom(
    http
      .post(
        'https://dev-326tk4zu.us.auth0.com/oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: 'sQPoZzmH4QaAHVEJrDaK3pPeHG0SmCtr',
          client_secret:
            'u6gsaL3kmxHPSmAYVXoJxaD5gbz0x3WhyRZQAzY7calz0y40rwmP2wOBbzigVTOt',
          audience: 'https://dev-326tk4zu.us.auth0.com/api/v2/',
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
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  async getEmailFromUserId(userId: string) {
    const token = await getAuth0Token(this.httpService);
    return lastValueFrom(
      this.httpService
        .get(`https://dev-326tk4zu.us.auth0.com/api/v2/users/${userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
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

  requestRoles(requestReason, rolesRequested, email, userId): boolean {
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

      this.mailerService
        .sendMail({
          to: process.env.ADMIN_EMAIL,
          from: 'vectoratlas-donotreply@icipe.org',
          subject: 'Role request',
          html: requestHtml,
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          throw err;
        });
      return true;
    } catch {
      return false;
    }
  }
}
