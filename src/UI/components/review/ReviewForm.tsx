import { Button, Grid, TextareaAutosize, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { approveDataset } from '../../state/review/actions/approveDataset';
import { downloadDatasetData } from '../../state/review/actions/downloadData';
import { getDatasetMetadata } from '../../state/review/actions/getDatasetMetadata';

function ReviewForm({ datasetId }: { datasetId: string }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (datasetId) {
      dispatch(getDatasetMetadata(datasetId));
    }
  }, [dispatch, datasetId]);

  const download_data = () => {
    dispatch(downloadDatasetData(datasetId));
  };

  const datasetMetadata = useAppSelector(
    (state) => state.review.datasetMetadata
  );
  const approvalLoading = useAppSelector((state) => state.review.loading);

  const approveDatasetClick = () => {
    dispatch(approveDataset({ datasetId }));
  };

  if (datasetId) {
    if (datasetMetadata.UpdatedBy !== '') {
      return (
        <div>
          <Grid container justifyContent={'space-between'} spacing={3}>
            <Grid item>
              <Typography>
                Data uploaded by {datasetMetadata.UpdatedBy} on{' '}
                {datasetMetadata.UpdatedAt}
              </Typography>
            </Grid>
            <Grid item>
              <div>
                <Button
                  variant="contained"
                  data-testid="dataDownload"
                  onClick={download_data}
                >
                  Download data
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
            <Grid
              item
              sm={12}
              md={12}
              container
              direction="row"
              alignItems="right"
            >
              <Button variant="outlined">Request changes</Button>
              <Button
                variant="contained"
                data-testid="approveButton"
                disabled={approvalLoading}
                onClick={approveDatasetClick}
              >
                Approve data
              </Button>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <p>
          The dataset id in the URL ({datasetId}) does not match a dataset.
          Please check the id and try again.
        </p>
      );
    }
  } else {
    return (
      <p>
        Please include a valid dataset_id in the url - i.e.
        &apos;http://vectoratlas.icipe.org/review
        <strong>?dataset=example_id</strong>
        &apos;
      </p>
    );
  }
}

export default ReviewForm;
