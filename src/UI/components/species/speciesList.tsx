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
  Box,
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

// Marianne's specific Dominant Species list for bolding/hierarchy
const DOMINANT_SPECIES = [
  'arabiensis', 
  'funestus', 
  'funestus complex', 
  'gambiae complex', 
  'gambiae_s form', 
  'coluzzii_gambiae_m form', 
  'stephensi'
];

export default function SpeciesList(): JSX.Element {
  const t = useTranslations('SpeciesPage');
  const router = useRouter();
  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);
  const isEditor = useAppSelector((state) => state.auth.roles.includes('editor'));
  const dispatch = useDispatch<AppDispatch>();

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

  // 1. Requirement: Alphabetical Order
  const sortedItems = [...(speciesList.items || [])].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const panelStyle = {
    boxShadow: 1,
    margin: '10px 0',
    borderRadius: 2,
    padding: 3,
    border: '1px solid #eee',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.01)',
      cursor: 'pointer',
    },
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography color="primary" variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {t('title')}
        </Typography>
        {isEditor && (
          <Button variant="contained" onClick={() => router.push('/species/edit')}>
            {t('buttons.create')}
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {sortedItems.map((row) => {
          // Check if species is Dominant (Primary)
          const cleanName = row.name.replace(/^An\.\s?/, '').toLowerCase().trim();
          const isDominant = DOMINANT_SPECIES.includes(cleanName);

          return (
            // FIX: Added non-null assertion row.id! for the key
            <Grid item xs={12} key={row.id!}>
              <Box sx={panelStyle}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <img 
                      alt={row.name} 
                      src={row.speciesImage} 
                      style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '150px' }} 
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ 
                        fontWeight: isDominant ? 900 : 400, 
                        fontStyle: 'italic',
                        fontSize: isDominant ? '1.25rem' : '1.1rem'
                      }}
                    >
                      {row.name.startsWith('An.') ? row.name : `An. ${row.name}`}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: isDominant ? 'orange' : 'text.secondary', fontWeight: 'bold' }}>
                        {isDominant ? "Primary Species (Dominant)" : "Secondary Species"}
                    </Typography>

                    <Box sx={{ mt: 1, mb: 1 }}>
                      <ReactMarkdown>{row.shortDescription}</ReactMarkdown>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                      {isEditor && (
                        <>
                          {/* FIX: Cast row.id as string */}
                          <Button size="small" variant="outlined" onClick={() => handleEdit(row.id as string)}>
                            {t('buttons.edit')}
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(row.id as string)}>
                            {t('buttons.deleteItem')}
                          </Button>
                        </>
                      )}
                      {/* FIX: Cast row.id as string */}
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleClick(row.id as string)}
                      >
                        {t('buttons.more')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('confirmDeleteMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('buttons.cancel')}</Button>
          <Button onClick={handleConfirmDelete} color="error">{t('buttons.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}