import { Box, Container, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import SectionPanel from '../components/layout/sectionPanel';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  getSpeciesInformation,
  getSpeciesPageData,
} from '../state/speciesInformation/actions/upsertSpeciesInfo.action';

function IndividualSpecies(): JSX.Element {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const speciesDetails: any = useAppSelector(
    (state) => state.speciesInfo.speciesList.items
  ).find((species) => species.id === router.query.id);

  return (
    <div>
      <main>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px',
            maxWidth: isMatch ? null : '75%',
          }}
        >
          <SectionPanel title="Aedes Albopictus">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Box
                sx={{
                  height: 200,
                }}
                component="img"
                alt="Mosquito Species #1"
                src="/species/mosquito_PNG18159.png"
              />
              <Box>
                <Typography color="primary">
                  Id - #{speciesDetails.id}
                </Typography>
                <Typography color="primary">
                  Description - {speciesDetails.description}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: '80%',
              }}
              component="img"
              alt="Mosquito Distribution"
              src="/species/distributionPlaceholder.PNG"
            />
            <Box></Box>
          </SectionPanel>
        </Container>
      </main>
    </div>
  );
}

export default IndividualSpecies;
