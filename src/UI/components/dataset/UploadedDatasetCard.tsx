import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StatusRenderer } from '../shared/statusRenderer';
import DateRenderer from '../shared/dateRenderer';

export interface DatasetCardLabels {
  title?: string; // optional, defaults to "Title"
  datasetType: string;
  uploaderCountry: string;
  approvalStatus: string;
  uploadedOn: string;
  pendingReupload: string;
}

interface UploadedDatasetCardProps {
  row: any;
  labels: DatasetCardLabels;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, row: any) => void;
}

// Label above a value.
// `emphasize` makes the label bold and larger. The value always stays normal weight.
const Field = ({
  label,
  children,
  emphasize = false,
  sx,
}: {
  label: string;
  children: React.ReactNode;
  emphasize?: boolean;
  sx?: object;
}) => (
  <Box sx={{ minWidth: 0, ...sx }}>
    <Typography
      display="block"
      sx={{
        mb: 0.5,
        lineHeight: 1.2,
        ...(emphasize
          ? {
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '0.85rem' },
              color: 'text.primary',
            }
          : {
              fontSize: '0.75rem',
              color: 'text.secondary',
            }),
      }}
    >
      {label}
    </Typography>
    <Box sx={{ wordBreak: 'break-word', fontWeight: 400, lineHeight: 1.4 }}>
      {children}
    </Box>
  </Box>
);

export const UploadedDatasetCard = ({
  row,
  labels,
  onMenuOpen,
}: UploadedDatasetCardProps) => {
  const needsReupload = row.is_reupload_requested && !row.is_reuploaded;

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        borderColor: 'rgba(15, 23, 42, 0.12)',
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Title row: title on the left, menu on the right */}
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
        >
          <Field label={labels.title ?? 'Title'} emphasize sx={{ flex: 1 }}>
            <Link
              href={`/uploaded-dataset/${row.id}`}
              underline="hover"
              sx={{ wordBreak: 'break-word' }}
            >
              {row.title}
            </Link>
            {needsReupload && (
              <Chip
                size="small"
                color="secondary"
                label={labels.pendingReupload}
                sx={{ ml: 1, verticalAlign: 'middle' }}
              />
            )}
          </Field>
          <IconButton
            size="small"
            aria-label="actions"
            onClick={(event) => onMenuOpen(event, row)}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>

        {/* Details panel: groups the remaining fields together */}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid rgba(15, 23, 42, 0.06)',
          }}
        >
          <Field label={labels.datasetType} emphasize>
            {row.dataset_type}
          </Field>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              mt: 1.5,
            }}
          >
            <Field
              label={labels.uploaderCountry}
              emphasize
              sx={{ flex: '1 1 90px' }}
            >
              {row.source_country}
            </Field>
            <Field
              label={labels.approvalStatus}
              emphasize
              sx={{ flex: '1 1 90px' }}
            >
              <StatusRenderer status={row.status} statusTitle={row.status} />
            </Field>
            <Field
              label={labels.uploadedOn}
              emphasize
              sx={{ flex: '1 1 90px' }}
            >
              <DateRenderer value={row.last_upload_date} />
            </Field>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UploadedDatasetCard;
