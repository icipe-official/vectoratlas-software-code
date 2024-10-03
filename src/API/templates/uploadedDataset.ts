export const getNewUploadDataSetTemplate = (title: string) => {
  return `<div>
      <h2>Dataset Uploaded</h2>
        <p>Dataset ${title} has been uploaded and will be reviewed before it is published into Vector Atlas </p>
        <p>Thanks,</p>
        <p>Vector Atlas</p>
        <p>Do not reply to this email. This is a system generated email</p>
    </div>`;
};

export const getApproveDataSetTemplate = (title: string) => {
  return `<div>
      <h2>Dataset Approved</h2>
        <p>Dataset ${title} has been approved and is ready for ingestion into Vector Atlas </p>
        <p>Thanks,</p>
        <p>Vector Atlas</p>
        <p>Do not reply to this email. This is a system generated email</p>
    </div>`;
};

export const getRejectRawDataSetTemplate = (
  title: string,
  actionDetails: string,
) => {
  return `<div>
      <h2>Dataset Approved</h2>
      <p>Dataset ${title} has been rejected because of the following reasons:</p>
      <p> ${actionDetails} </p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      <p>Do not reply to this email. This is a system generated email</p>
  </div>`;
};

export const getRejectReviewedDataSetTemplate = (
  title: string,
  actionDetails: string,
) => {
  return `<div>
      <h2>Dataset Approved</h2>
      <p>Dataset ${title} has been rejected because of the following reasons:</p>
      <p> ${actionDetails} </p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      <p>Do not reply to this email. This is a system generated email</p>
  </div>`;
};