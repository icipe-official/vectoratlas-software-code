import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTranslations } from 'next-intl';
import { InlineMarkdown } from './sourceText';

import type { Source } from '../../state/source/sourceSlice';

// Negative side margin on phones, in theme spacing units (-3 = 24px).
// Set this to match the padding of the container around this list.
const MOBILE_BLEED = -3;

interface SourceCardsProps {
  items?: Source[];
  canEdit: boolean;
  orderBy: string;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  onEdit: (num_id: number) => void;
  onDelete: (num_id: number) => void;
}

// Markdown for strings, plain value for numbers
const renderValue = (value: string | number) =>
  typeof value === 'string' ? <InlineMarkdown>{value}</InlineMarkdown> : value;

// Show "Not recorded" when the year is missing or stored as 0
const isMissingYear = (year: string | number | null | undefined) =>
  year === null || year === undefined || year === '' || Number(year) === 0;

// Small label above a value, used for author, journal and year
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="div"
        color="text.secondary"
        sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: '0.85rem',
          lineHeight: 1.35,
          overflowWrap: 'anywhere',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function SourceCards({
  items = [],
  canEdit,
  orderBy,
  order,
  onSort,
  onEdit,
  onDelete,
}: SourceCardsProps) {
  const t = useTranslations('SourcesPage');

  // Same sortable fields as the desktop table header
  const sortOptions = [
    { id: 'author', label: t('grid.author') },
    { id: 'article_title', label: t('grid.title') },
    { id: 'journal_title', label: t('grid.journalTitle') },
    { id: 'year', label: t('grid.year') },
  ];

  return (
    <Box
      sx={{
        // On phones, the list stretches past the container padding to the screen edges
        mx: { xs: MOBILE_BLEED, sm: 0 },
      }}
    >
      {/* Phones have no column headers, so sorting moves to chips */}
      <Stack
        direction="row"
        spacing={0.75}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: 1, px: { xs: -MOBILE_BLEED, sm: 0 } }}
      >
        {sortOptions.map((option) => {
          const active = orderBy === option.id;
          return (
            <Chip
              key={option.id}
              label={option.label}
              onClick={() => onSort(option.id)}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              icon={
                active ? (
                  order === 'asc' ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )
                ) : undefined
              }
              data-testid={`sort-chip-${option.id}`}
              sx={{ height: 34, px: 0.5, fontSize: '0.8rem' }}
            />
          );
        })}
      </Stack>

      {items.map((row) => (
        <Card
          key={row.num_id}
          variant="outlined"
          data-testid={`card-${row.num_id}`}
          sx={{
            mb: 1,
            width: '100%',
            // Phones: content on top, buttons below.
            // Wider screens: buttons sit beside the content, on the same line.
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              minWidth: 0,
              px: 1.5,
              pt: 1.25,
              pb: 1,
              '&:last-child': { pb: 1 },
            }}
          >
            {/* Title: smaller and tighter so long titles take fewer lines */}
            <Typography
              component="div"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 1,
                overflowWrap: 'anywhere',
              }}
            >
              {renderValue(row.article_title)}
            </Typography>

            {/* Author and Year sit together; Journal gets the full width below */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                columnGap: { xs: 3.5, sm: 2.5 }, // wider gap on phones
                rowGap: 0.75,
                mb: 0.75,
              }}
            >
              <Box sx={{ minWidth: 0, maxWidth: '65%' }}>
                <Field label={t('grid.author')}>
                  {renderValue(row.author)}
                </Field>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Field label={t('grid.year')}>
                  {isMissingYear(row.year)
                    ? t('grid.notRecorded')
                    : renderValue(row.year)}
                </Field>
              </Box>
            </Box>

            <Field label={t('grid.journalTitle')}>
              {renderValue(row.journal_title)}
            </Field>
          </CardContent>

          {canEdit && (
            <CardActions
              sx={{
                flexShrink: 0,
                gap: 1,
                px: { xs: 1.5, sm: 2 },
                pt: 0,
                pb: { xs: 1.25, sm: 0 },
                pr: { sm: 2 },
              }}
            >
              <Button
                variant="outlined"
                size="small"
                data-testid={`edit-${row.num_id}`}
                onClick={() => onEdit(row.num_id)}
                sx={{
                  minHeight: 36,
                  py: 0.5,
                  flex: { xs: 1, sm: '0 0 auto' },
                  minWidth: { sm: 88 },
                  fontSize: '0.8rem',
                }}
              >
                {t('edit')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                data-testid={`delete-${row.num_id}`}
                onClick={() => onDelete(row.num_id)}
                sx={{
                  minHeight: 36,
                  py: 0.5,
                  flex: { xs: 1, sm: '0 0 auto' },
                  minWidth: { sm: 88 },
                  fontSize: '0.8rem',
                }}
              >
                {t('delete')}
              </Button>
            </CardActions>
          )}
        </Card>
      ))}
    </Box>
  );
}
