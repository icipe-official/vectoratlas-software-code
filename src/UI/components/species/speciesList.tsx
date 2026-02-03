import { useEffect, useState } from 'react';
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
import { useTranslations } from 'next-intl';
import { getAllSpecies } from '../../state/speciesInformation/actions/getAllSpecies';

export default function SpeciesList(): JSX.Element {
  const t = useTranslations('SpeciesPage');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllSpecies());
  }, [dispatch]);

  const handleClick = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/species/details', query: { id: speciesId } });
  };

  const handleEdit = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/species/edit', query: { id: speciesId } });
  };

  const handleDeleteClick = (speciesId: string) => {
    setSelectedSpeciesId(speciesId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSpeciesId) {
      dispatch(deleteSpeciesInformation(selectedSpeciesId));
    }
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  // 🔹 Alphabetical sorting (A → Z)
  const sortedSpecies = [...speciesList.items].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
          {t('title')}
        </Typography>

        {isEditor && (
          <Button
            variant="contained"
            style={{ height: '50%' }}
            onClick={() => router.push('/species/edit')}
          >
            {t('buttons.create')}
          </Button>
        )}
      </div>

      <Grid container spacing={4} data-testid="speciesPanelGrid">
        {sortedSpecies.map((row) => (
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
                      alt={row.name}
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
                    color="primary"
                    sx={{ fontWeight: 'bold', fontStyle: 'italic' }}
                  >
                    {row.name}
                  </Typography>

                  <ReactMarkdown>
                    {row.shortDescription}
                  </ReactMarkdown>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ width: 'fit-content', borderRadius: 2 }}
                      onClick={() => handleClick(row.id as string)}
                    >
                      <ArrowForwardIcon
                        fontSize="medium"
                        sx={{ marginRight: 1 }}
                      />
                      {t('buttons.more')}
                    </Button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditor && (
                      <Button
                        variant="contained"
                        className="EditButton"
                        onClick={() => handleEdit(row.id as string)}
                      >
                        {t('buttons.edit')}
                      </Button>
                    )}

                    {isEditor && (
                      <Button
                        sx={{ backgroundColor: 'red', ml: 1 }}
                        variant="contained"
                        onClick={() => handleDeleteClick(row.id as string)}
                        className="DeleteButton"
                      >
                        {t('buttons.deleteItem')}
                      </Button>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('confirmDeleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('confirmDeleteMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('buttons.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t('buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
