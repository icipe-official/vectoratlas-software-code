export const stringTypeResolver = () => String;
export const numberTypeResolver = () => Number;

/**
 * Approval status
 */
export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

/**
 * Different sources where DOI can originate from
 */
export enum DOISourceType {
  DOWNLOAD = 'Download',
  UPLOAD = 'Upload',
  MODEL_UPLOAD = 'Model Upload',
}

/**
 * Different actions that can be performed against a dataset
 */
// export enum UploadedDatasetActionType {
//   NEW_UPLOAD = 'New Dataset Upload',
//   UPDATE = 'Update Dataset Details',
//   REUPLOAD = 'Dataset Re-Upload',
//   SEND_EMAIL = 'Send Email',
//   APPROVE = 'Approve Dataset',
//   REVIEW = 'Review Dataset',
//   ASSIGN_PRIMARY_REVIEWERS = 'Assign Primary Reviewers',
//   ASSIGN_TERTIARY_REVIEWERS = 'Assign Tertiary Reviewers',
//   REJECT_RAW = 'Reject Raw Dataset',
//   REJECT_REVIEWED = 'Reject Reviewed Data',
//   GENERATE_DOI = 'Generate DOI',
//   COMPLETE_PRIMARY_REVIEW = 'Complete Primary Review',
//   COMPLETE_TERTIARY_REVIEW = 'Complete Tertiary Review',
// }

/**
 * Different actions that can be performed against an uploaded dataset
 */
export enum UploadedDatasetActionTypeEnum {
  NEW_UPLOAD = 'New Dataset Upload',
  UPDATE = 'Update Dataset Details',
  REUPLOAD = 'Dataset Re-Upload',
  REVIEW = 'Review Dataset',
  ASSIGN_PRIMARY_REVIEWERS = 'Assign Primary Reviewers',
  COMPLETE_PRIMARY_REVIEW = 'Complete Primary Review',
  ASSIGN_TERTIARY_REVIEWERS = 'Assign Tertiary Reviewers',
  REASSIGN_TERTIARY_REVIEWERS = 'Reassign Tertiary Reviewers',
  COMPLETE_TERTIARY_REVIEW = 'Complete Tertiary Review',
  APPROVE = 'Approve Dataset',
  REJECT = 'Reject Dataset',
  REJECT_RAW = 'Reject Raw Dataset',
  REJECT_REVIEWED = 'Reject Reviewed Data',
  SEND_EMAIL = 'Send Email',
  GENERATE_DOI = 'Generate DOI',
  VALIDATE = 'Validate Dataset',
  ADHOC_VALIDATE = 'Adhoc Dataset Validation',
  REQUEST_REUPLOAD = 'Request Dataset Re-upload',
}

/**
 * Different actions that can be performed against a dataset
 */
export enum DoiActionType {
  APPROVE = 'Approve Doi',
  REJECT = 'Reject Doi',
}

export enum CommunicationChannelType {
  EMAIL = 'Email',
}

export enum CommunicationSentStatus {
  PENDING = 'Pending',
  SENT = 'Sent',
  FAILED = 'Failed',
}

export enum UploadedDatasetStatus {
  PENDING = 'Pending',
  PRIMARY_REVIEW = 'Primary Review',
  PENDING_ASSIGNING_TERTIARY_REVIEW = 'Pending Tertiary Review',
  TERTIARY_REVIEW = 'Tertiary Review',
  REJECTED = 'Rejected',
  REJECTED_BY_MANAGER = 'Rejected By Reviewer Manager',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
}

export enum UploadedModelStatus {
  PENDING = 'Pending',
  PRIMARY_REVIEW = 'Primary Review',
  PENDING_ASSIGNING_TERTIARY_REVIEW = 'Pending Tertiary Review',
  TERTIARY_REVIEW = 'Tertiary Review',
  REJECTED = 'Rejected',
  REJECTED_BY_MANAGER = 'Rejected By Reviewer Manager',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
}

/**
 * Different actions that can be performed against an uploaded dataset
 */

export enum UploadedModelActionTypeEnum {
  NEW_UPLOAD = 'New Model Upload',
  UPDATE = 'Update Model Details',
  REUPLOAD = 'Model Re-Upload',
  REVIEW = 'Review Model',
  ASSIGN_PRIMARY_REVIEWERS = 'Assign Primary Reviewers',
  COMPLETE_PRIMARY_REVIEW = 'Complete Primary Review',
  ASSIGN_TERTIARY_REVIEWERS = 'Assign Tertiary Reviewers',
  REASSIGN_TERTIARY_REVIEWERS = 'Reassign Tertiary Reviewers',
  COMPLETE_TERTIARY_REVIEW = 'Complete Tertiary Review',
  APPROVE = 'Approve Model',
  REJECT = 'Reject Model',
  REJECT_RAW = 'Reject Raw Model',
  REJECT_REVIEWED = 'Reject Reviewed Data',
  SEND_EMAIL = 'Send Email',
  GENERATE_DOI = 'Generate DOI',
  VALIDATE = 'Validate Model',
  ADHOC_VALIDATE = 'Adhoc Model Validation',
  REQUEST_REUPLOAD = 'Request Model Re-upload',
}
