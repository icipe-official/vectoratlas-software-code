import React, { useState, useMemo } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SendIcon from '@mui/icons-material/Send';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import { useUser } from '@auth0/nextjs-auth0/client';

export interface UnifiedRecipient {
  id: string;
  name: string;
  email: string;
  source: 'user' | 'subscriber';
  isDisabled: boolean;
  statusLabel: string;
  roles?: string[];
}

interface ComposeMessageFormProps {
  loading?: boolean;
  recipientsList?: UnifiedRecipient[];
  onSend?: (data: {
    subject: string;
    recipients: string[];
    message: string;
  }) => void;
  files?: File[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const ComposeMessageForm: React.FC<ComposeMessageFormProps> = ({
  loading = false,
  recipientsList = [],
  onSend,
}) => {
  const { user } = useUser();
  const [subject, setSubject] = useState('');
  const [audienceMode, setAudienceMode] = useState<
    'all' | 'subscribers' | 'users' | 'custom'
  >('custom');
  const [selectedRecipients, setSelectedRecipients] = useState<
    UnifiedRecipient[]
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const senderName = user?.name || user?.nickname || 'Vector Altlas Team';
  const senderEmail = user?.email || '';
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({
    subject: false,
    recipients: false,
    message: false,
  });

  const activeRecipientEmails = useMemo(() => {
    const eligible = recipientsList.filter((r) => !r.isDisabled);

    if (audienceMode === 'all') {
      return eligible.map((r) => r.email);
    }
    if (audienceMode === 'subscribers') {
      return eligible
        .filter((r) => r.source === 'subscriber')
        .map((r) => r.email);
    }
    if (audienceMode === 'users') {
      return eligible.filter((r) => r.source === 'user').map((r) => r.email);
    }
    return selectedRecipients.filter((r) => !r.isDisabled).map((r) => r.email);
  }, [audienceMode, recipientsList, selectedRecipients]);

  const subjectError = touched.subject && !subject.trim();
  const recipientsError =
    touched.recipients && activeRecipientEmails.length === 0;
  const messageError = touched.message && !message.trim();

  const isFormValid =
    subject.trim() !== '' &&
    activeRecipientEmails.length > 0 &&
    message.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ subject: true, recipients: true, message: true });

    if (!isFormValid || loading) return;

    if (onSend) {
      onSend({
        subject,
        recipients: Array.from(new Set(activeRecipientEmails)),
        message,
      });
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 850, mx: 'auto', my: 3, position: 'relative' }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Compose Message
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="audience-mode-label">Recipient Group</InputLabel>
              <Select
                labelId="audience-mode-label"
                label="Recipient Group"
                value={audienceMode}
                onChange={(e) => {
                  setAudienceMode(e.target.value as any);
                  setTouched((prev) => ({ ...prev, recipients: true }));
                }}
              >
                <MenuItem value="custom">Custom(Users / Subscribers)</MenuItem>
                <MenuItem value="all">Users & Subscribers</MenuItem>
                <MenuItem value="subscribers">All Subscribers Only</MenuItem>
                <MenuItem value="users">All Users Only</MenuItem>
              </Select>
            </FormControl>

            {audienceMode === 'custom' ? (
              <Autocomplete
                multiple
                fullWidth // <--- Forces horizontal reach to 100%
                limitTags={5}
                disableCloseOnSelect
                options={recipientsList}
                value={selectedRecipients}
                disabled={loading}
                getOptionDisabled={(option) => option.isDisabled}
                getOptionLabel={(option) =>
                  option.name === option.email
                    ? option.email
                    : `${option.name} (${option.email})`
                }
                onChange={(_, newValue) => {
                  setSelectedRecipients(newValue);
                  setTouched((prev) => ({ ...prev, recipients: true }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, recipients: true }))
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.email}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      disabled={option.isDisabled}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">
                        {option.name === option.email
                          ? option.email
                          : `${option.name} (${option.email})`}
                      </Typography>
                      <Chip
                        size="small"
                        label={option.statusLabel}
                        color={
                          option.isDisabled
                            ? 'default'
                            : option.source === 'subscriber'
                            ? 'info'
                            : 'primary'
                        }
                        variant="outlined"
                      />
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth // <--- Forces the inner input's horizontal reach
                    label="Select Recipients *"
                    placeholder="Search by name, email, or role..."
                    error={recipientsError}
                    helperText={
                      recipientsError
                        ? 'Please select at least one valid recipient'
                        : 'Unsubscribed accounts and users with disabled notifications are grayed out.'
                    }
                  />
                )}
              />
            ) : (
              <TextField
                fullWidth
                disabled
                label="Selected Recipients"
                value={`Sending to ${activeRecipientEmails.length} recipient(s)`}
                helperText="Unsubscribed accounts and users with disabled notifications are automatically excluded."
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0,0,0,0.87)',
                    fontWeight: 600,
                  },
                }}
              />
            )}

            <TextField
              label="Subject"
              fullWidth
              required
              disabled={loading}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
              error={subjectError}
              helperText={subjectError ? 'Subject cannot be empty' : ''}
            />

            <Box>
              <TextEditor
                label="Message Body *"
                description={message}
                initialDescription=""
                hideBlockTypeSelector={true}
                setDescription={(val: string) => {
                  setMessage(val);
                  if (!touched.message) {
                    setTouched((prev) => ({ ...prev, message: true }));
                  }
                }}
                error={messageError}
                helperText={messageError ? 'Message cannot be empty' : ''}
              />
            </Box>
            {/*<Box sx={{ mt: 2 }}>
  <Button
    variant="outlined"
    component="label"
    size="small"
  >
    Attach Files ({files.length})
    <input
      type="file"
      hidden
      multiple
      onChange={(e) => {
        if (e.target.files) {
          setFiles(Array.from(e.target.files));
        }
      }}
    />
  </Button>
     {files.length > 0 && (
     <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {files.map((file, idx) => (
        <Chip
          key={idx}
          label={file.name}
          size="small"
          onDelete={() => setFiles(files.filter((_, i) => i !== idx))}
        />
         ))}
          </Box>
         )}
          </Box>*/}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SendIcon />}
                disabled={!isFormValid || loading}
              >
                Send ({activeRecipientEmails.length})
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
