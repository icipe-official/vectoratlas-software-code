import { Paper, Typography, Divider, Box, Button, Grid } from "@mui/material";

export default function AboutBanner() {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" color="primary" m="20px">
        Analyses-Ready Data and Spatial Models Specifically Tailored to Inform
        Malaria Vector Control
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Box>
        <Typography variant="body1" m="20px" mb="0px">
          The Vector Atlas brings together a new collaboration of partners
          (icipe, University of Oxford, MAP, PAMCA, GBIF, VectorBase, IRMapper,
          BMGF) in an initiative to build an online, open access repository to
          hold and share our analyses-ready malaria vector occurrence,
          bionomics, abundance, and insecticide resistance data. Our data will
          be fully up to date and form the basis of a series of spatial models
          specifically tailored to inform the control of mosquito vectors of
          disease.
        </Typography>
        <Grid container justifyContent="flex-end">
          <Button variant="contained">Join Mailing List</Button>
          <Button variant="outlined">Find out more</Button>
        </Grid>
      </Box>
    </Paper>
  );
}
