import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormLabel,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { useRouter } from 'next/router';
import { getCommunicationLog } from '../../state/communicationLog/actions/communicationLog.actions';
import { StatusRenderer } from '../shared/statusRenderer';
import { fetchAllUsersDetails } from '../../api/api';
import { useTranslations } from 'next-intl';

interface DisplayItemProps {
  label: string;
  value: string;
  isHtml?: boolean;
  isLast?: boolean;
}

// One label/value row: faded line underneath (none on the last row) and a
// faded vertical separator between the label and value columns
const DisplayItem = (props: DisplayItemProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        py: 1.5,
        '&::after': props.isLast
          ? { display: 'none' }
          : {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.25), transparent)',
            },
      }}
    >
      <FormLabel
        filled
        color="error"
        sx={{
          flex: '0 0 40%',
          minWidth: 0,
          fontWeight: 'bold',
          overflowWrap: 'anywhere',
          alignSelf: 'center',
        }}
      >
        {props.label}
      </FormLabel>

      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          wordBreak: 'break-word',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '-16px',
            top: 0,
            bottom: 0,
            width: '1px',
            background:
              'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.25), transparent)',
          },
        }}
      >
        {props.isHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: props.value?.toString() || '' }}
          />
        ) : (
          <FormLabel>{props.value}</FormLabel>
        )}
      </Box>
    </Box>
  );
};

const CommunicationLogDetails = () => {
  const t = useTranslations('CommunicationDetailPage');

  const dispatch = useAppDispatch();
  const communicationLog = useAppSelector(
    (state) => state.communicationLog.currentCommunicationLog
  );
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [recipients, setRecipients] = useState<string[]>([]);
  const token = useAppSelector((state) => state.auth.token);

  // Memoize the data value
  const memoizedRecipients = useMemo(() => recipients, [recipients]);

  useEffect(() => {
    if (router.isReady && id && token) {
      dispatch(getCommunicationLog(id));
    }
  }, [id, dispatch, token, router.isReady]);

  useEffect(() => {
    const setEmails = async () => {
      if (!communicationLog?.recipients || !token) return;

      const recipientsList = Array.isArray(communicationLog.recipients)
        ? communicationLog.recipients
        : communicationLog.recipients
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

      if (recipientsList.length === 0) return;

      const resolved = await Promise.all(
        recipientsList.map(async (entry: string) => {
          if (entry.includes('@')) return entry;
          try {
            const res = await fetchAllUsersDetails(token, entry);
            return res?.name || entry;
          } catch {
            return entry;
          }
        })
      );
      setRecipients(resolved);
    };
    setEmails();
  }, [communicationLog, token]);

  return (
    <div>
      <main>
        {/* Full-bleed wrapper: on phones it spans the whole screen width and is
            centred by offsetting half the difference from the parent's centre.
            This ignores the parent's padding. Inner padding keeps content off
            the screen edges. From sm up it reverts to the normal layout. */}
        <Box
          sx={{
            width: { xs: '100vw', sm: 'auto' },
            ml: { xs: 'calc(50% - 50vw)', sm: 0 },
            px: { xs: 1, sm: 0 },
            boxSizing: 'border-box',
            minWidth: 0,
          }}
        >
          {/* Returns to the Communication List */}
          <Box sx={{ mt: 1, mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => router.push('/communication-log')}
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(0, 133, 63, 0.08)',
                },
              }}
            >
              Back to Communication List
            </Button>
          </Box>

          <Typography variant="h5" color="primary">
            {t('title')}
          </Typography>

          <Card
            variant="outlined"
            sx={{ padding: 1, margin: 0, border: 'none' }}
          >
            <CardHeader
              avatar={
                <Grid2
                  container
                  spacing={2}
                  sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
                >
                  <Grid2 sx={{ padding: 1 }}>
                    <Typography variant="h6">
                      {communicationLog?.subject}
                    </Typography>
                  </Grid2>
                  <Grid2>
                    <StatusRenderer
                      status={communicationLog?.sent_status || ''}
                    />
                  </Grid2>
                  <Grid2 sx={{ padding: 1 }}>
                    <Typography variant="caption">
                      {communicationLog?.sent_status}
                    </Typography>
                  </Grid2>
                </Grid2>
              }
            />
          </Card>

          <Card
            sx={{
              width: '100%',
              minWidth: 0,
              borderRadius: '12px',
            }}
          >
            <CardContent sx={{ px: 1.25, pt: 1.25, pb: '8px !important' }}>
              <Box>
                <DisplayItem
                  label={t('form.messageType')}
                  value={communicationLog?.message_type || ''}
                />
                <DisplayItem
                  label={t('form.channelType')}
                  value={communicationLog?.channel_type || ''}
                />
                <DisplayItem
                  label={t('form.sentStatus')}
                  value={communicationLog?.sent_status || ''}
                />
                <DisplayItem
                  label={t('form.recipients')}
                  value={memoizedRecipients.join(', ')}
                />
                <DisplayItem
                  label={t('form.referenceType')}
                  value={communicationLog?.reference_entity_type || ''}
                />
                <DisplayItem
                  label={t('form.referenceName')}
                  value={communicationLog?.reference_entity_name || ''}
                />
                <DisplayItem
                  label={t('form.sentDate')}
                  value={communicationLog?.sent_date?.toString() || ''}
                />
                <DisplayItem
                  label={t('form.sentResponse')}
                  value={communicationLog?.sent_response || ''}
                />
                <DisplayItem
                  label={t('form.message')}
                  isHtml
                  isLast
                  value={communicationLog?.message || ''}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </main>
    </div>
  );
};

export default CommunicationLogDetails;
