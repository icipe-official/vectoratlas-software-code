export const getApproveDoiTemplate = (
  title: string,
  doi_url: string,
  comments?: string,
) => {
  return `<div>
        <h2>DOI Approved</h2>
          <p>Doi ${doi_url} for dataset ${title} has been approved. </p>
          <p>${comments}</p>
          <p>Thanks,</p>
          <p>Vector Atlas</p>
          <p>Do not reply to this email. This is a system generated email</p>
      </div>`;
};

export const getRejectDoiTemplate = (title: string, comments?: string) => {
  return `<div>
        <h2>DOI Rejected</h2>
          <p>Doi for dataset ${title} was not approved. </p>
          <p>${comments}</p>
          <p>Thanks,</p>
          <p>Vector Atlas</p>
          <p>Do not reply to this email. This is a system generated email</p>
      </div>`;
};
