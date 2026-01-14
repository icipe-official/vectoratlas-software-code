/**
 * Email template for DOI approval notification
 */
export const getApproveDoiTemplate = (
  title: string,
  doiLink: string,
  comments?: string,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">DOI Request Approved</h2>
      <p>Dear Contributor,</p>
      <p>We are pleased to inform you that your DOI request has been <strong>approved</strong>.</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>DOI Link:</strong> <a href="${doiLink}" style="color: #007bff;">${doiLink}</a></p>
      </div>
      ${comments ? `<div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
        <p><strong>Reviewer Comments:</strong></p>
        <p>${comments}</p>
      </div>` : ''}
      <p>Thank you for your contribution to the Vector Atlas.</p>
      <p>Best regards,<br>The Vector Atlas Team</p>
    </div>
  `;
};

export const getRejectDoiTemplate = (
  title: string,
  comments?: string,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">DOI Request Rejected</h2>
      <p>Dear Contributor,</p>
      <p>We regret to inform you that your DOI request has been <strong>rejected</strong>.</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
        <p><strong>Title:</strong> ${title}</p>
      </div>
      ${comments ? `<div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
        <p><strong>Reason for Rejection:</strong></p>
        <p>${comments}</p>
      </div>` : ''}
      <p>If you have questions or would like to submit a revised request, please contact us.</p>
      <p>Best regards,<br>The Vector Atlas Team</p>
    </div>
  `;
};
