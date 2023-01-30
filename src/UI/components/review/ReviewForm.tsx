import {
  Button,
  Grid,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { useAppDispatch } from '../../state/hooks';
import { downloadDatasetData } from '../../state/review/actions/downloadData';

function ReviewForm({datasetId}: { datasetId: string }) {
  const dispatch = useAppDispatch();
  const download_data = () => {
    dispatch(downloadDatasetData(datasetId))
  };

  if (datasetId) {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <div>
              <TextField
                id="outlined-basic"
                value={datasetId}
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
    return <p>Please include a dataset_id in the url - e.g. 'http://vectoratlas.icipe.org/review<strong>?dataset=example_id</strong>'</p>;
  }
}

export default ReviewForm;
