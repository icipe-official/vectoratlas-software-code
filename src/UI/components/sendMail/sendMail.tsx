import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { sendNewEmail } from '../../api/api';
import { marked } from 'marked';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailPopup({ isOpen, onClose }: EmailPopupProps): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const [emailInput, setEmailInput] = useState('');
  const [ccEmailInput, setCcEmailInput] = useState('');
  const [body, setBody] = useState('');
  const [tittle, setTittle] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageColor, setMessageColor] = useState<'green' | 'red' | null>(null);

  const validateEmailFormat = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const parseEmails = (input: string): string[] => {
    return input
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '' && validateEmailFormat(email));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setEmailInput(input);
    const validEmails = parseEmails(input);
    setEmails(validEmails);
  };

  const handleCcEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCcEmailInput(input);
    const validEmails = parseEmails(input);
    setCcEmails(validEmails);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  const sendEmail = async () => {
    const formData = new FormData();
    formData.append('emails', JSON.stringify(emails));
    formData.append('ccEmails', JSON.stringify(ccEmails));
    formData.append('title', tittle);
    const htmlBody = await marked(body);
    formData.append('emailBody', htmlBody);
    attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const result = await sendNewEmail(formData);
      if (result.success) {
        setMessage('Email sent successfully!');
        setMessageColor('green');
        setEmailInput('');
        setTittle('');
        setBody('');
        setCcEmailInput('');
        setEmails([]);
        setCcEmails([]);
        setAttachedFiles([]);
      } else {
        setMessage('Failed to send email.');
        setMessageColor('red');
      }
    } catch (error) {
      setMessage('An error occurred while sending the email.');
      setMessageColor('red');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontSize="small">Send Email:</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '10px' }}>
        <Container
          maxWidth={false}
          sx={{
            padding: '1px',
            maxWidth: isMatch ? '100%' : '100%',
            fontSize: 'small',
          }}
        >
          <Typography color="primary" fontSize="small" sx={{ mt: 2, mb: 1 }}>
            Recipient Emails (separated by commas)
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: '100%', fontSize: 'small' }}
            value={emailInput}
            placeholder='send to?'
            onChange={handleEmailChange}
            error={emails.length === 0}
            helperText={emails.length === 0 ? 'Please provide at least one valid email.' : ''}
            InputProps={{
              style: { fontSize: 'small' },
            }}
            InputLabelProps={{
              style: { fontSize: 'small' },
            }}
          />
          <Box mt={1}>
            {emails.map((e, index) => (
              <Chip key={index} label={e} sx={{ marginRight: 1, marginBottom: 1, fontSize: 'small' }} />
            ))}
          </Box>

          <Typography color="primary" fontSize="small" sx={{ mt: 2, mb: 1 }}>
            CC Emails (separated by commas)
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: '100%' }}
            value={ccEmailInput}
            placeholder='cc?'
            onChange={handleCcEmailChange}
            helperText="Optional"
            InputProps={{
              style: { fontSize: 'small' },
            }}
            InputLabelProps={{
              style: { fontSize: 'small' },
            }}
          />
          <Box mt={1}>
            {ccEmails.map((e, index) => (
              <Chip key={index} label={e} sx={{ marginRight: 1, marginBottom: 1, fontSize: 'small' }} />
            ))}
          </Box>

          <Typography color="primary" fontSize="small" sx={{ mt: 2, mb: 1 }}>
            Email Title
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: '100%' }}
            value={tittle}
            placeholder='Enter email title'
            onChange={(e) => setTittle(e.target.value)}
            error={tittle === ''}
            helperText={tittle === '' ? 'Title cannot be empty' : ''}
            InputProps={{
              style: { fontSize: 'small' },
            }}
            InputLabelProps={{
              style: { fontSize: 'small' },
            }}
          />

          <Typography color="primary" fontSize="small" sx={{ mt: 2, mb: 1 }}>
            Email Body
          </Typography>
          <TextEditor
            description={body}
            setDescription={setBody}
            initialDescription=""
            error={body === ''}
            helperText={body === '' ? 'Email body cannot be empty' : ''}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" component="label" style={{ width: '50%', minWidth: '200px', fontSize: 'small' }}>
              <UploadIcon />
              Attach Files
              <input type="file" hidden multiple onChange={handleFileUpload} />
            </Button>
            <Box mt={1}>
              {attachedFiles.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                  sx={{ marginRight: 1, marginBottom: 1, fontSize: 'small' }}
                />
              ))}
            </Box>
          </div>
        </Container>
      </DialogContent>
      <div>
        {message && (
            <Typography
              sx={{ mt: 2, textAlign: 'center', color: messageColor }}
            >
              {message}
            </Typography>
          )}
        </div>
      <DialogActions>
        <Button
          variant="contained"
          disabled={!emails.length || !tittle || !body}
          onClick={sendEmail}
          sx={{ m: 1, minWidth: 120, fontSize: 'small' }}
        >
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}
