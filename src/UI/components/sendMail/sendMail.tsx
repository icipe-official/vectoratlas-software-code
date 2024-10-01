import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Box,
} from '@mui/material';
import { TextEditor } from '../shared/textEditor/RichTextEditor';
import UploadIcon from '@mui/icons-material/Upload';
import { sendNewEmail } from '../../api/api';
export default function SourcesPage(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [tittle, setTittle] = useState('');
  const [copyEmail, setCopyEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [copyEmails, setCopyEmails] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageColor, setMessageColor] = useState<'green' | 'red' | null>(null);
  const validateEmailFormat = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const emailValid = email !== '' && validateEmailFormat(email);
  const validFormat = validateEmailFormat(email);
  const tittleValid = tittle !== '';
  const bodyValid = body !== '';
  const addEmail = () => {
    if (emailValid) {
      setEmails((prev) => [...prev, email]);
      setEmail('');
    }
  };
  const addCopyEmail = () => {
    if (copyEmail && validateEmailFormat(copyEmail)) {
      setCopyEmails((prev) => [...prev, copyEmail]);
      setCopyEmail('');
    }
  };
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  }
  const sendEmail = async () => {
    const formData = new FormData();
    formData.append('emails', JSON.stringify(emails));
    formData.append('copyEmails', JSON.stringify(copyEmails));
    formData.append('title', tittle);
    formData.append('emailBody', body);
    attachedFiles.forEach((file, index) => {
      formData.append("files", file);
    });
    try {
      const result = await sendNewEmail(formData);
      if (result.success) {
        setMessage("Email sent successfully!");
        setMessageColor('green');
        setEmail('');
        setTittle('');
        setBody('');
        setCopyEmail('');
        setEmails([]);
        setCopyEmails([]);
        setAttachedFiles([]);
      } else {
        setMessage("Failed to send email.");
        setMessageColor('red');
      }
    } catch (error) {
      setMessage("An error occurred while sending the email.");
      setMessageColor('red');
    }
  };
  const removeEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };
  const removeCopyEmail = (index: number) => {
    setCopyEmails((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '1px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <div>
            <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
              Recipient Emails
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                variant="outlined"
                sx={{ width: '100%' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={ !emailValid || !email && emails.length === 0 }
                helperText={
                  emails.length === 0 && !email
                    ? 'Email cannot be empty'
                    : !emailValid && emails.length === 0
                    ? 'Provide a valid Email'
                    : ''
                }
              />
              <Button
                variant="contained"
                onClick={addEmail}
                disabled={!emailValid}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            <Box mt={1}>
              {emails.map((e, index) => (
                <Chip
                  key={index}
                  label={e}
                  onDelete={() => removeEmail(index)}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                />
              ))}
            </Box>
            <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
              Copy Emails
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                variant="outlined"
                sx={{ width: '100%' }}
                value={copyEmail}
                onChange={(e) => setCopyEmail(e.target.value)}
                error={ !!copyEmail && !validateEmailFormat(copyEmail) }
                helperText={
                  copyEmail && !validateEmailFormat(copyEmail) 
                    ? 'Provide a valid Email'
                    : ''
                }
              />
              <Button
                variant="contained"
                onClick={addCopyEmail}
                disabled={!validateEmailFormat(copyEmail)}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            <Box mt={1}>
              {copyEmails.map((e, index) => (
                <Chip
                  key={index}
                  label={e}
                  onDelete={() => removeCopyEmail(index)}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                />
              ))}
            </Box>
            <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
              Email Tittle
            </Typography>
            <TextField
              variant="outlined"
              sx={{ width: '100%' }}
              value={tittle}
              onChange={(e) => setTittle(e.target.value)}
              error={!tittleValid}
              helperText={!tittleValid ? 'Tittle cannot be empty' : ''}
            />
            <Typography color="primary" variant="h5" sx={{ mt: 2, mb: 1 }}>
              Email Body
            </Typography>
            <TextEditor
              description={body}
              setDescription={setBody}
              initialDescription=""
              error={!bodyValid}
              helperText={!bodyValid ? 'Email body cannot be empty' : ''}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              component="label"
              style={{ width: '50%', minWidth: '250px' }}
            >
              <UploadIcon />
              Attach Files
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileUpload}
              />
            </Button>
            <Box mt={1}>
              {attachedFiles.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                />
              ))}
            </Box>
          </div>
          <Button
            variant="contained"
            disabled={!emails || !tittleValid || !bodyValid}
            onClick={sendEmail}
            sx={{ m: 1, minWidth: 150 }}
          >
            Send Email
          </Button>
          {message && (
            <Typography
              sx={{ mt: 2, textAlign: 'center', color: messageColor }}
            >
              {message}
            </Typography>
          )}
        </Container>
      </main>
    </div>
  );
}