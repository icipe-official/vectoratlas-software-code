import { Button, Grid, Typography } from '@mui/material';
import { useAppSelector } from '../../state/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setCurrentInfoDetails } from '../../state/speciesInformation/speciesInformationSlice';
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function SpeciesList(): JSX.Element {
  const router = useRouter();

  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (speciesId: string) => {
    dispatch(setCurrentInfoDetails(speciesId));
    router.push({ pathname: '/speciesDetails', query: { id: speciesId } });
  };

  return (
    <Grid container spacing={4}>
      {speciesList.items.map((row) => (
        <Grid
          onClick={() => handleClick(row.id)}
          container
          item
          key={row.id}
          sx={{
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
          }}
        >
          <Grid container direction="row" justifyContent="space-around">
            <Grid
              container
              item
              sx={{
                width: '10%',
              }}
              component="img"
              alt="Mosquito Species #1"
              src={`data:image/jpeg;base64,${row.speciesImage}`}
            />
            <Grid sx={{ width: '75%' }}>
              <Typography
                variant="h6"
                color={'primary'}
                sx={{ fontWeight: 'bold' }}
              >
                {row.name}
              </Typography>
              <Grid
                container
                item
                sx={{
                  marginTop: 1,
                  borderRadius: 2,
                }}
              >
                <Grid container direction={'column'}>
                  <Grid>{row.shortDescription}</Grid>
                  <Grid
                    container
                    direction={'row'}
                    sx={{ justifyContent: 'end' }}
                  >
                    <Button sx={{ width: 'fit-content', borderRadius: 2 }}>
                      <ArrowForwardIcon
                        fontSize={'medium'}
                        sx={{ marginRight: 1 }}
                      />
                      See more details
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
