export const getApproveDoiTemplate = (
  title: string,
  doi_url: string,
  comments?: string,
) => {
  return `<div>
        <h2>DOI Approved</h2>
          <p>DOI for <strong> ${title} </strong> has been approved and generated. <a href="${doi_url}"> Click here</a></p>
          <p>${comments}</p>
          <p>Thanks,</p>
          <p>Vector Atlas</p>
          <p>Do not reply to this email. This is a system generated email</p>
      </div>`;
};

export const getRejectDoiTemplate = (title: string, comments?: string) => {
  return `<div>
        <h2>DOI Rejected</h2>
          <p>DOI for <strong> ${title} </strong> was not approved. </p>
          <p>${comments}</p>
          <p>Thanks,</p>
          <p>Vector Atlas</p>
          <p>Do not reply to this email. This is a system generated email</p>
      </div>`;
};
