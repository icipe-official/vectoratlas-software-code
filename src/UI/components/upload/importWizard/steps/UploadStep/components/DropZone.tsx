import React, { useRef } from 'react';
import { readExcelFile } from '../../../utils';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { ImportWizardState } from '../../../types';

const Container = (props) => {
  const getColor = () => {
    console.log('Getting color: ', props);
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
    borderColor: () => getColor(),
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };
  return <Box sx={style}>{props.children}</Box>;
};

interface Props {
  state: ImportWizardState;
  onFileAccepted: (v: ImportWizardState) => Promise<void>;
}

export const DropZone = ({ state, onFileAccepted }: Props) => {
  const fileName = state.fileName;
  // const style = useMemo(
  //   () => ({
  //     ...baseStyle,
  //     ...(isFocused ? focusedStyle : {}),
  //     ...(isDragAccept ? acceptStyle : {}),
  //     ...(isDragReject ? rejectStyle : {}),
  //   }),
  //   [isFocused, isDragAccept, isDragReject]
  // );

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
    // onDrop: (incomingFiles) => {
    //   if (hiddenInputRef.current) {
    //     const dataTransfer = new DataTransfer();
    //     incomingFiles.forEach((v) => {
    //       dataTransfer.items.add(v);
    //     });
    //   }
    // },
    onDropAccepted: async ([file]) => {
      state.loading = true;
      const workbook = await readExcelFile(file);
      state.fileName = file.name;
      state.workbook = workbook;
      state.loading = false;
      await onFileAccepted(state);
    },
    onDropRejected(fileRejections, event) {
      state.loading = false;
      fileRejections.forEach((rejection) => {
        toast.error(rejection.errors[0].message);
      });
    },
  });

  const getColor = (props) => {
    console.log('Getting color: ', props);
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
    // borderColor: () => getColor(),
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
        {/*
          Add a hidden file input 
          Best to use opacity 0, so that the required validation message will appear on form submission
        */}
        <input
          type="file"
          required={true}
          style={{ opacity: 0 }}
          ref={hiddenInputRef}
        />
        <input {...getInputProps()} />
        <p>Drag and drop some a file here</p>
        {/* <button type="button" onClick={open}>
          Open File Dialog
        </button> */}
        {fileName && (
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {fileName}
          </Typography>
        )}
      </Box>
      <aside>
        {/* <h4>Files</h4> */}
        {/* <ul>{files}</ul> */}
      </aside>
    </Box>
  );

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <Box sx={{ borderStyle: 'dotteds' }}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Dummy dic</p>
        </div>
      </Box>
    </Box>
  );
};
