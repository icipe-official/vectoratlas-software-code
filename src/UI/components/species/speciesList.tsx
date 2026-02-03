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
  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);
  const isEditor = useAppSelector((state) =>
    state.auth.roles.includes('editor')
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllSpecies());
  }, [dispatch]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null);

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

  // Marianne's Requirement: Alphabetical Order
  const sortedItems = [...(speciesList.items || [])].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
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
        {sortedItems.map((row) => (
          <Grid container item key={row.id} sx={panelStyle} data-testid={`speciesPanel${row.id}`}>
            <Grid container direction="row" justifyContent="space-around">
              <Grid item lg={3} md={6} justifyContent="center" display="flex">
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <picture>
                    <img alt={row.name} src={row.speciesImage} style={{ width: '100%' }} />
                  </picture>
                </div>
              </Grid>
              <Grid item lg={9} md={6}>
                <div>
                  <Typography
                    variant="h6"
                    color={'primary'}
                    sx={{ fontWeight: 'bold', fontStyle: 'italic' }}
                  >
                    {/* Marianne's Requirement: Prefaced with 'An.' */}
                    {row.name.startsWith('An.') ? row.name : `An. ${row.name}`}
                  </Typography>
                  <ReactMarkdown>{row.shortDescription}</ReactMarkdown>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ width: 'fit-content', borderRadius: 2 }}
                      onClick={() => handleClick(row.id as string)}
                    >
                      <ArrowForwardIcon fontSize={'medium'} sx={{ marginRight: 1 }} />
                      {t('buttons.more')}
                    </Button>
                  </div>
                  {isEditor && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleEdit(row.id as string)}
                      >
                        {t('buttons.edit')}
                      </Button>
                      <Button
                        sx={{ backgroundColor: 'red' }}
                        variant="contained"
                        onClick={() => handleDeleteClick(row.id as string)}
                      >
                        {t('buttons.deleteItem')}
                      </Button>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('confirmDeleteMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">{t('buttons.cancel')}</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>{t('buttons.delete')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}