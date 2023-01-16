import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}

  requestRoles(requestReason, rolesRequested, email, userId): Boolean {
    try {
      const requestHtml = `<div>
      <h2>Role Request</h2>
      <p>User ${email} with id ${userId} has requested access to the following roles: ${rolesRequested.join(', ')}. </p>
      <p>Reason given:</p>
      <b> ${requestReason} </b>
      <p>If this request is approved, please change the row in the 'user_role' table with auth0_id=${userId}.</p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      </div>`

      this.mailerService.sendMail({
        to: 'andrew.kitchener@capgemini.com',
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Role request',
        html: requestHtml
      }).then(() => {
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
