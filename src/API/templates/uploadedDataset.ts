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
      <h2>Dataset Rejected</h2>
      <p>Dataset '${title}' has been rejected because of the following reasons:</p>
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
      <h2>Dataset Rejected</h2>
      <p>Dataset ${title} has been rejected because of the following reasons:</p>
      <p> ${actionDetails} </p>
      <p>Thanks,</p>
      <p>Vector Atlas</p>
      <p>Do not reply to this email. This is a system generated email</p>
  </div>`;
};

export const getReviewDataSetTemplate = (
  datasetId: string,
  reviewerId: string,
  reviewFeedback: string,
) => {
  const url = process.env.BASE_URL || 'https://www.vectoratlas.icipe.org';
  const review_res = `<div>
  <h2>Reviewer Feedback</h2>
  <p>Dataset with id ${datasetId} has been reviewed. Please see review comments below, and visit ${url}/review?dataset=${datasetId} to make changes.
  This dataset has been reviewed by ${reviewerId}</p>
  <p>${reviewFeedback}</p>
  </div>`;

  return review_res;
};
 
export const getAssignPrimaryReviewerTemplate = (
  datasetId: string,
  comment: string,
) => {
  const url = process.env.BASE_URL || 'https://www.vectoratlas.icipe.org';
  const review_res = `<div>
  <h2>Primary Reviewer Assignment</h2>
  <p>Dataset with id ${datasetId} has been assigned to you for primary review. Visit ${url}/uploaded-dataset/${datasetId} to access the dataset. 
  <p>${comment}</p>
  </div>`;

  return review_res;
};

export const getAssignTertiaryReviewerTemplate = (
  datasetId: string,
  comment: string,
) => {
  const url = process.env.BASE_URL || 'https://www.vectoratlas.icipe.org';
  const review_res = `<div>
  <h2>Tertiary Reviewer Assignment</h2>
  <p>Dataset with id ${datasetId} has been assigned to you for tertiary review. Visit ${url}/uploaded-dataset/${datasetId} to access the dataset. 
  <p>${comment}</p>
  </div>`;

  return review_res;
};

