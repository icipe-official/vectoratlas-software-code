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
}

/**
 * Different actions that can be performed against a dataset
 */
export enum UploadedDatasetActionType {
  NEW_UPLOAD = 'New Dataset Upload',
  UPDATE = 'Update Dataset Details',
  REUPLOAD = 'Dataset Re-Upload',
  COMMUNICATION = 'Communication',
  APPROVE = 'Approve Dataset',
  REVIEW = 'Review Dataset',
  ASSIGN_PRIMARY_REVIEW = 'Assign Primary Reviewers',
  ASSIGN_TERTIARY_REVIEW = 'Assign Tertiary Reviewers',
  REJECT_RAW = 'Reject Raw Dataset',
  REJECT_REVIEWED = 'Reject Reviewed Data',
  GENERATE_DOI = 'Generate DOI',
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
  APPROVED = 'Approved',
  PRIMARY_REVIEW = 'Primary Review',
  TERTIARY_REVIEW = 'Tertiary Review',
  REJECTED = 'Rejected',
  REJECTED_BY_MANAGER = 'Rejected By Reviewer Manager',
  PENDING_ASSIGNING_TERTIARY_REVIEW = 'PendingTertiaryAssignment',
  PENDING_APPROVAL = 'Pending Approval'
}
