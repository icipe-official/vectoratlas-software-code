import React, { useRef } from 'react';
import { readExcelFile } from '../../../utils';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { ImportWizardState } from '../../../types';
import { useTranslations } from 'next-intl';

interface Props {
  state: ImportWizardState;
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
}

export const DropZone = ({ state, onFileAccepted }: Props) => {
  const t = useTranslations('UploadWizardPage');
  const fileName = state.fileName;
  const hiddenInputRef = useRef(null);
  const {
    getRootProps,
    getInputProps,
    open,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: 254000000,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/csv': ['.csv'],
    },
    onDropAccepted: async ([file]) => {
      state.loading = true;
      const workbook = await readExcelFile(file);
      state.fileName = file.name;
      state.workbook = workbook;
      state.loading = false;
      state.rawDataFile = file;
      await onFileAccepted(state);
    },
    onDropRejected(fileRejections, _event) {
      state.loading = false;
      fileRejections.forEach((rejection) => {
        toast.error(rejection.errors[0].message);
      });
    },
  });

  const getColor = (props: any) => {
    if (props.isDragAccept) {
      return '#00e676';
    }
    if (props.isDragReject) {
      return '#ff1744';
    }
    if (props.isFocused) {
      return '#2196f3';
    }
    return '#eeeeee';
  };

  const style = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: getColor(
      getRootProps({ isFocused, isDragAccept, isDragReject })
    ),
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  return (
    <Box className="container">
      <Box
        {...getRootProps({
          className: 'dropzone',
          isFocused,
          isDragAccept,
          isDragReject,
        })}
        sx={style}
      >
        <p>
          {t('uploadStep.dragZonePlaceholder') ||
            'Drag and drop an .xlsx file here'}
        </p>
        {/*
          Add a hidden file input 
          Best to use opacity 0, so that the required validation message will appear on form submission
        */}
        <input
          type="file"
          required={true}
          style={{ opacity: 0, border: 'solid 1px red' }}
          ref={hiddenInputRef}
        />
        <input {...getInputProps()} />
        {fileName && (
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {fileName}
          </Typography>
        )}
        <button
          type="button"
          onClick={open}
          style={{ border: 'solid 1px grey', padding: 5 }}
        >
          {t('uploadStep.browseFile') || 'Browse File'}
        </button>
      </Box>
      <aside>
        {/* <h4>Files</h4> */}
        {/* <ul>{files}</ul> */}
      </aside>
    </Box>
  );
};
