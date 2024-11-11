import {
  Box,
  Button,
  Container,
  FormLabel,
  InputProps,
  CircularProgress,
  Card,
  CardContent,
  Link,
  Chip,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloudDownload from '@mui/icons-material/CloudDownload';
import { SaveOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { downloadRawDatasetFile } from '../../api/api';
import {
  getUploadedDataset,
  reuploadDataset,
} from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { useRouter } from 'next/router';
import React from 'react';
import { CustomizedSnackBar } from '../shared/CustomizedSnackBar';
import { ApproveRejectDialog } from '../shared/approveRejectDialog';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { approveUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { rejectUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { reviewUploadedDataset } from '../../state/uploadedDataset/actions/uploaded-dataset.action';
import { StatusRenderer } from '../shared/statusRenderer';
import UploadIcon from '@mui/icons-material/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { marked } from 'marked';
import { toast } from 'react-toastify';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ASSIGN: string = 'Assign';
const APPROVE: string = 'Approve';
const REVIEW: string = 'Review';
const REJECT: string = 'Reject';
const VALIDATE: string = 'Validate';

const ACTION_TYPES = [APPROVE, REJECT, VALIDATE];

type ReuploadDatasetProps = {
  datasetId?: string;
};

interface DisplayItemProps {
  label: string;
  value: string | React.ReactNode;
  isHtml?: boolean;
  isComponent?: boolean;
}

const DisplayItem = (props: DisplayItemProps) => {
  return (
    <Grid2
      container
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <Grid2 xs={3} sx={{ padding: 2 }}>
        <FormLabel filled color="error" sx={{ fontWeight: 'bold' }}>
          {props.label}
        </FormLabel>
      </Grid2>
      {!props.isComponent && (
        <Grid2 xs={8}>
          {props.isHtml && (
            <div
              dangerouslySetInnerHTML={{
                __html: props?.value?.toString() || '',
              }}
            />
          )}
          {!props.isHtml && <FormLabel>{props.value}</FormLabel>}
        </Grid2>
      )}
      {props.isComponent && <Grid2 xs={8}>{props.value}</Grid2>}
    </Grid2>
  );
};

const DisplayFile = ({ label, url }: { label: string; url: string }) => {
  return (
    <DisplayItem
      label={label}
      isComponent
      value={<Link href={url}>{url.split('/').pop()}</Link>}
    />
  );
};

const ReuploadDatasetForm = (props: ReuploadDatasetProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [datasetId, setDatasetId] = useState(props.datasetId || '');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [richComments, setRichComments] = useState('');

  const uploadedDataset = useAppSelector(
    (state) => state.uploadedDataset.currentUploadedDataset
  );
  const loading = useAppSelector((state) => state.uploadedDataset.loading);
  const downloading = useAppSelector(
    (state) => state.uploadedDataset.downloading
  );

  const isProcessingAction = useAppSelector(
    (state) => state.uploadedDataset.isProcessingAction
  );

  const allowReupload = useAppSelector(
    (state) =>
      state.uploadedDataset.currentUploadedDataset.is_reupload_requested
  );

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setAttachedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    if (attachedFiles.length == 0) {
      toast.error('You must attach a file');
      return;
    }
    const formData = new FormData();
    const commentsHtml = await marked(richComments);
    //formData.append('comments', commentsHtml);
    formData.append('comments', richComments /*commentsHtml*/);
    attachedFiles.forEach((file) => {
      formData.append('files', file);
    });

    await dispatch(
      reuploadDataset({
        datasetId: datasetId,
        files: attachedFiles,
        comments: richComments,
      })
    );
    router.push({
      pathname: '/',
    });
  };

  useEffect(() => {
    const getDataset = async () => {
      if (datasetId) {
        dispatch(getUploadedDataset(datasetId));
      }
      //setDataset(res);
    };
    getDataset();
  }, [dispatch, datasetId]);

  useEffect(() => {
    setDatasetId(props?.datasetId || '');
  }, [props.datasetId]);

  return (
    <div>
      <Container>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 /*width: '100ch'*/ },
            maxWidth: '100%',
            bgcolor: '#fff',
          }}
          noValidate
          autoComplete="off"
        >
          {/* <div>
            <StatusRenderer
              status={uploadedDataset?.status || ''}
              statusTitle={uploadedDataset?.status}
              label={uploadedDataset?.title}
            />
          </div> */}

          <Card>
            <CardContent>
              <DisplayItem
                label="Dataset Title"
                value={uploadedDataset?.title}
              />
              <Box sx={{ flexGrow: 1 }}>
                {uploadedDataset?.uploaded_file_name && (
                  <DisplayFile
                    label="Original data"
                    url={uploadedDataset?.uploaded_file_name}
                  />
                )}
                {allowReupload && (
                  <DisplayItem
                    label="New Dataset"
                    isComponent
                    value={
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Button
                          variant="text"
                          component="label"
                          //   style={{ width: '50%', minWidth: '200px', fontSize: 'small' }}
                        >
                          <UploadIcon />
                          Attach File
                          <input
                            type="file"
                            hidden
                            required
                            multiple={false}
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls, .csv"
                          />
                        </Button>
                        <Box mt={1}>
                          {attachedFiles.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() =>
                                setAttachedFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              sx={{
                                marginRight: 1,
                                marginBottom: 1,
                                fontSize: 'small',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                )}
              </Box>

              {allowReupload && (
                <DisplayItem
                  label="Comments"
                  isComponent
                  value={
                    <ReactQuill
                      value={richComments}
                      onChange={(val) => setRichComments(val)}
                      placeholder="Write your comments here..."
                      // style={{ minHeight: '300px' }}
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          [{ header: '1' }, { header: '2' }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ align: [] }],
                          [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
                          ],
                          [{ color: [] }, { background: [] }],
                          ['image' /*, 'link'*/, 'clean'],
                        ],
                      }}
                      formats={[
                        'header',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'list',
                        'bullet',
                        'link',
                        'indent',
                        'align',
                        'image',
                        'color',
                        'background',
                      ]}
                    />
                  }
                />
              )}
            </CardContent>
          </Card>
          {allowReupload && (
            <div>
              <Button
                // component="label"
                type="submit"
                role={undefined}
                variant="contained"
                disabled={isProcessingAction}
                startIcon={<SaveOutlined />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          )}
          {/* <SnackBarItems /> */}
          {loading && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default ReuploadDatasetForm;
