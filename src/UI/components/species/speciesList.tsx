import { useState } from 'react';
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAppSelector } from '../../state/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setCurrentInfoDetails } from '../../state/speciesInformation/speciesInformationSlice';
import { deleteSpeciesInformation } from '../../state/speciesInformation/actions/upsertSpeciesInfo.action';
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

export default function SpeciesList(): JSX.Element {
  const router = useRouter();
  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );
  const dispatch = useDispatch<AppDispatch>();

  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(
    null
  ); // State for selected species ID

  const handleClick = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/species/details', query: { id: speciesId } });
  };

  const handleEdit = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/species/edit', query: { id: speciesId } });
  };

  const handleDeleteClick = (speciesId: string) => {
    setSelectedSpeciesId(speciesId); // Set selected species ID
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (selectedSpeciesId) {
      dispatch(deleteSpeciesInformation(selectedSpeciesId)); // Dispatch the delete action
    }
    setOpenDialog(false); // Close the dialog after confirming delete
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const panelStyle = {
    boxShadow: 3,
    margin: 3,
    borderRadius: 2,
    paddingBottom: 4,
    paddingRight: 4,
    border: 3,
    borderColor: 'rgba(0,0,0,0)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.02)',
      cursor: 'pointer',
      border: 3,
    },
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        <Typography color="primary" variant="h4" style={{ flexGrow: 1 }}>
          Species List
        </Typography>
        {isEditor ? (
          <Button
            variant="contained"
            style={{ height: '50%' }}
            onClick={() => router.push('/species/edit')}
          >
            Create new species page
          </Button>
        ) : null}
      </div>

      <Grid container spacing={4} data-testid="speciesPanelGrid">
        {speciesList.items.map((row) => (
          <Grid
            container
            item
            key={row.id}
            sx={panelStyle}
            data-testid={`speciesPanel${row.id}`}
          >
            <Grid container direction="row" justifyContent="space-around">
              <Grid item lg={3} md={6} justifyContent="center" display="flex">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <picture>
                    <img
                      alt="Mosquito Species #1"
                      src={row.speciesImage}
                      style={{ width: '100%' }}
                    />
                  </picture>
                </div>
              </Grid>
              <Grid lg={9} md={6}>
                <div>
                  <Typography
                    variant="h6"
                    color={'primary'}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {row.name}
                  </Typography>
                  <ReactMarkdown>{row.shortDescription}</ReactMarkdown>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ width: 'fit-content', borderRadius: 2 }}
                      onClick={() => handleClick(row.id as string)}
                    >
                      <ArrowForwardIcon
                        fontSize={'medium'}
                        sx={{ marginRight: 1 }}
                      />
                      See more details
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditor && (
                      <Button
                        variant="contained"
                        className="EditButton"
                        onClick={() => handleEdit(row.id as string)}
                      >
                        Edit item
                      </Button>
                    )}
                    {isEditor && (
                      <Button
                        sx={{
                          backgroundColor: 'red',
                        }}
                        variant="contained"
                        onClick={() => handleDeleteClick(row.id as string)} // Handle delete click
                        className="DeleteButton"
                      >
                        Delete item
                      </Button>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        ))}
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
            Are you sure you want to delete this species information? This
            action cannot be undone.
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
    </div>
  );
}
