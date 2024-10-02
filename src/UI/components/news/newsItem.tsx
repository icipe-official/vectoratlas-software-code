import React, { useState } from 'react';
import { News } from '../../state/state.types';
import {
  Button,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { deleteNews } from '../../state/news/actions/news.action';

export const NewsItem = ({
  item,
  isEditor,
  hideMoreDetailsButton,
}: {
  item: News;
  isEditor: boolean;
  hideMoreDetailsButton?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleEditClick = () => {
    router.push('/news/edit?id=' + item.id);
  };

  const handleMoreDetailsClick = () => {
    router.push('/news/article?id=' + item.id);
  };

  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null); // State for selected species ID

  const handleDelete = (newsId: string) => {
    setSelectedNewsId(newsId); // Set selected species ID
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (selectedNewsId) {
      dispatch(deleteNews(selectedNewsId)); // Dispatch the delete action
    }
    setOpenDialog(false); // Close the dialog after confirming delete
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  return (
    <Paper sx={{ margin: 0, marginLeft: '2px' }}>
      <Grid
        container
        spacing={0}
        sx={{ justifyContent: 'center' }}
        className="BannerGrid"
      >
        <Grid item xs={12} md={9} key="content">
          <CardContent className="Content">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a style={{ color: 'blue' }} {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 style={{ margin: 0 }} {...props} />
                ),
              }}
            >
              {'## ' + item.title}
            </ReactMarkdown>

            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a style={{ color: 'blue' }} {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p
                    style={{
                      marginTop: 15,
                      marginBottom: 0,
                      textAlign: 'justify',
                    }}
                    {...props}
                  />
                ),
              }}
            >
              {item.summary}
            </ReactMarkdown>
          </CardContent>
          <Grid sx={{ justifyContent: 'end', width: '100%', display: 'flex' }}>
            {!hideMoreDetailsButton && (
              <Button
                variant="outlined"
                onClick={handleMoreDetailsClick}
                className="ViewButton"
              >
                More details
              </Button>
            )}
            {isEditor && (
              <Button
                variant="contained"
                onClick={handleEditClick}
                className="EditButton"
              >
                Edit item
              </Button>
            )}
            {isEditor && (
              <Button
                sx={{ backgroundColor: 'red' }}
                variant="contained"
                onClick={() => handleDelete(item.id as string)}
                className="EditButton"
              >
                Delete item
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          key={item.title}
          sx={{ height: '50vh', maxHeight: '40vh' }}
        >
          <CardMedia
            className="Media"
            image={item.image}
            sx={{ height: '100%', overflow: 'hidden' }}
          ></CardMedia>
        </Grid>
        {/* Dialog Box */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this News? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Paper>
  );
};
