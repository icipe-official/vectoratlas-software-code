import { Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useAppSelector } from '../../state/hooks';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setCurrentInfoDetails } from '../../state/speciesInformation/speciesInformationSlice';
import { useRouter } from 'next/router';

export default function SpeciesList(): JSX.Element {
  const router = useRouter();

  const speciesList = useAppSelector((state) => state.speciesInfo.speciesDict);

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (id: string) => {
    dispatch(setCurrentInfoDetails(id));
    router.push('/individualSpecies');
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
            paddingBottom: '32px',
            paddingRight: '32px',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            color={'primary'}
            sx={{ width: '100%', fontWeight: 'bold', marginBottom: 5 }}
          >
            {row.name}
          </Typography>
          <Grid
            container
            direction="row"
            spacing={5}
            justifyContent="space-around"
          >
            <Grid
              container
              item
              sx={{
                width: '25%',
              }}
              component="img"
              alt="Mosquito Species #1"
              src={`data:image/jpeg;base64,${row.speciesImage}`}
            />
            <Grid
              container
              item
              sx={{
                width: '65%',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 2,
              }}
            >
              <Grid container sx={{ height: 'fit-content' }}>
                <Grid
                  xs={2}
                  sx={{
                    flex: 1,
                    backgroundColor: 'primary.main',
                    color: 'secondary.main',
                    fontWeight: 'bold',
                    padding: 0.5,
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  Short Description
                </Grid>
                <Grid
                  sx={{
                    flex: 1,
                    padding: 0.5,
                  }}
                >
                  &nbsp; {row.shortDescription}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
