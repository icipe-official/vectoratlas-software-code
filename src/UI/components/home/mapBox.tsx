import { Paper, Typography, Divider, Box, Button, Grid } from "@mui/material";
import MapComponent from "../map";

export default function MapBox() {
  return (
    <Paper sx={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
    }}>
      <MapComponent/>
    </Paper>
  )
}