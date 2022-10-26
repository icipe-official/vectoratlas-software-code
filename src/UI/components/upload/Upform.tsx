import { Button, Grid, AppBar, Toolbar, Container, Box } from '@mui/material';

function Upform() {
  return (
    <form>
      <Box sx={{ height: '75%' }}>
        …<input type="file" name="csv"></input>
        <Button variant="contained" size="large">
          Submit
        </Button>
      </Box>
    </form>
  );
}

export default Upform;
