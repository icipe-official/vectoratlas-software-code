export class ExportStatusDto {
	jobId: string;
	status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
	progress?: number;
	downloadUrl?: string;
	expiresAt?: Date;
	errorMessage?: string;
}
