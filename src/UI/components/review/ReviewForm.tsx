import { Button, Grid, ListItem, ListItemIcon, TextareaAutosize, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { approveDataset } from '../../state/review/actions/approveDataset';
import { downloadDatasetData } from '../../state/review/actions/downloadData';
import { getDatasetMetadata } from '../../state/review/actions/getDatasetMetadata';
import theme from '../../styles/theme';
import { sanitiseDate } from '../../utils/utils';
import { ReviewEventItem } from './reviewEvent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

export type ReviewEvent = {
  type: string,
  performedBy: string,
  performedAt: string
}

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
    if (datasetMetadata.status !== '') {
      const eventList: ReviewEvent[] = [];
      eventList.push({type: 'Uploaded', performedBy: datasetMetadata.UpdatedBy, performedAt: sanitiseDate(datasetMetadata.UpdatedAt)});
      datasetMetadata.ReviewedBy?.forEach((review, i) => {
        eventList.push({type: 'Reviewed', performedBy: review, performedAt: sanitiseDate(datasetMetadata.ReviewedAt[i])});
      })
      datasetMetadata.ApprovedBy?.forEach((approval, i) => {
        eventList.push({type: 'Approved', performedBy: approval, performedAt: sanitiseDate(datasetMetadata.ApprovedAt[i])});
      });
      eventList.sort((a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime());


      return (
        <div>
          <Grid container justifyContent={'space-between'} spacing={3}>
            <Grid item>
              <ListItem>
                <Typography variant='h5' >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {datasetMetadata.status === 'Uploaded' ? <FileUploadIcon sx={{color: theme.palette.secondary.main, margin: '5px'}}/> :
                    datasetMetadata.status === 'In review' ? <RemoveRedEyeIcon sx={{color: 'blue', margin: '5px'}} /> :
                    <DoneOutlineIcon  sx={{color: theme.palette.primary.main, margin: '5px'}}/>}
                </ListItemIcon>
                  Status: {datasetMetadata.status}
                </Typography>
              </ListItem>
              {datasetMetadata.status === 'In review' &&
              <ListItem>Two approvals are needed to change the status to 'Approved'</ListItem>}
              {eventList.map((event) => (
                <ReviewEventItem key={event.performedAt} event={event} />
              ))}
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
          {datasetMetadata.status !== 'Approved' &&
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
    }
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
