import { Button, Grid, AppBar, Toolbar, Container, Box } from '@mui/material';
import { upload } from '@testing-library/user-event/dist/types/setup/directApi';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';

function Upform() {
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFailure, setOpenFailure] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState(false);
  
  const [query, setQuery] = React.useState({
      file: ""
  })

  const validated_response = (res:any)=>{
    // res is an array of arrays:
    let test = false;
    if(Array.isArray(res)){
      test = true;
      for(let i=0; i<res.length; i++){
        if (res[i].length === 0){
          test = test && true;
        }else{
          test = test && false;
        }
      }
    }
    return test;
  }

  const upload_data = async (e:any) => {
    // call endpoint here for real upload process
    e.preventDefault();
    const formData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
        formData.append(key, value);
    });
    console.log(formData);
    const req = await fetch('/vector-api/ingest/uploadBionomics',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(formData)
    }).then((res) => {
      console.log('res');
      console.log(JSON.stringify(res));
      if (validated_response(res)) {
        setOpenSuccess(true);
      } else {
        setOpenFailure(true);
      }
    })
    return false;
  };

  const handleSubmit = (e:any) => {
    upload_data(e)
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
    setOpenFailure(false);
  };

  const handleFileChange = () => (e:any) => {
    setQuery((prevState) => ({
        ...prevState,
        files: e.target.files[0]
    }));
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <form method="POST" encType="multipart/form-data"  onSubmit={handleSubmit}>
        <Box sx={{ height: '75%' }}>
          <input type="file" name="file" required={true} onChange={handleFileChange()}/>
          <Button type="submit" variant="contained" size="large">
            Submit
          </Button>
          <Snackbar
            open={openSuccess}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Upload successfull"
            action={action}
          />
          <Snackbar
            open={openFailure}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Upload Failed"
            action={action}
          />
        </Box>
      </form>
    </div>
  );
}

export default Upform;
