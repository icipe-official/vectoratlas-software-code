import { Paper, Typography, Divider, Box, Button, Grid } from "@mui/material";

export default function NewsBox() {
  return (
    <Paper>
      <Box overflow="auto" flex={1} flexDirection="column" display="flex" flex-grow="1" p={2} >
        <Typography variant="h4" >
          News item 1
        </Typography>
        <Box display="flex">
          <Typography variant="body1" >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <picture>
            <img src='africa.svg' style={{maxHeight: '150px', paddingTop: '5px'}}/>
          </picture>
        </Box>
        <Divider flexItem />
        <Typography variant="h4" mt={3}>
          News item 2
        </Typography>
        <Box display="flex">
          <Typography variant="body1" >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <picture>
            <img src='mosquito.svg' style={{maxHeight: '150px', paddingTop: '5px'}}/>
          </picture>
        </Box>
        <Divider flexItem />
        <Typography variant="h4"  mt={3}>
          News item 3
        </Typography>
        <Box display="flex">
          <Typography variant="body1" >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <picture>
            <img src='testtube.svg' style={{maxHeight: '150px', paddingTop: '5px'}}/>
          </picture>
        </Box>
      </Box>
    </Paper>
  )
}