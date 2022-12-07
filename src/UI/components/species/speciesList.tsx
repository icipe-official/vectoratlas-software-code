import { Button, Grid, Typography } from '@mui/material';
import { useAppSelector } from '../../state/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setCurrentInfoDetails } from '../../state/speciesInformation/speciesInformationSlice';
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { width } from '@mui/system';

export default function SpeciesList(): JSX.Element {
  const router = useRouter();

  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/speciesDetails', query: { id: speciesId } });
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
    <Grid container spacing={4}>
      {speciesList.items.map((row) => (
        <Grid
          onClick={() => handleClick(row.id)}
          container
          item
          key={row.id}
          sx={panelStyle}
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
                <Typography>{row.shortDescription}</Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button sx={{ width: 'fit-content', borderRadius: 2 }}>
                    <ArrowForwardIcon
                      fontSize={'medium'}
                      sx={{ marginRight: 1 }}
                    />
                    See more details
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
