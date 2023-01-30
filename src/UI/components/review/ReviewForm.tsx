import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

function ReviewForm(props: any) {
  const [dataset, getDataset] = useState(null);

  useEffect(() => {
    // get dataset info from db
    let dataset_id = props.dataset_id;
  });

  const download_data = () => {
    alert('Attempt to download dataset identified by: ' + props?.dataset_id);
  };

  if (props.dataset_id) {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <div>
              <TextField
                id="outlined-basic"
                value={props.dataset_id}
                label="Dataset ID"
                disabled={true}
                variant="outlined"
              />
            </div>
          </Grid>
          <Grid item sm={12} md={4}>
            <div>
              <TextField
                id="outlined-basic"
                value={'demo@user.com'}
                label="Data uploaded by"
                disabled={true}
                variant="outlined"
              />
            </div>
          </Grid>
          <Grid item sm={12} md={4}>
            <div>
              <Button variant="contained" onClick={download_data}>
                Download csv
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item sm={12} md={12}>
            <div style={{ marginTop: 20 }}>
              <label htmlFor="area">Message</label>
              <br />
            </div>
            <TextareaAutosize
              id="area"
              aria-label="Message"
              minRows={3}
              placeholder="Add a review comment here ..."
              style={{ width: 400, marginTop: 20 }}
            />
          </Grid>
          <Grid item sm={12} md={12} 
            direction="row"
            justifyContent="center"
            alignItems="right">
            <Button variant="contained">Request changes</Button>
            <Button variant="contained">Approve data</Button>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <p>Sorry! dataset_id not provided.</p>;
  }
}

export default ReviewForm;
