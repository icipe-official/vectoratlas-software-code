import {
  Button,
  Grid,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { downloadDatasetData } from '../../state/review/actions/downloadData';
import { getDatasetMetadata } from '../../state/review/actions/getDatasetMetadata';

function ReviewForm({datasetId}: { datasetId: string }) {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getDatasetMetadata(datasetId));
  }, [dispatch])

  const download_data = () => {
    dispatch(downloadDatasetData(datasetId))
  };

  const datasetMetadata = useAppSelector(state => state.review.datasetMetadata);
  console.log(datasetMetadata)

  return (
    <div>
      <Grid container justifyContent={'space-between'} spacing={3}>
        <Grid item>
          <Typography>
            Data uploaded by {datasetMetadata.UpdatedBy} on {datasetMetadata.UpdatedAt}
          </Typography>
        </Grid>
        <Grid item>
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
            <label htmlFor="area">Review Comments</label>
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
  );/*
  } else {
    return <p>Please include a valid dataset_id in the url - e.g. 'http://vectoratlas.icipe.org/review<strong>?dataset=example_id</strong>'</p>;
  } */
}

export default ReviewForm;
