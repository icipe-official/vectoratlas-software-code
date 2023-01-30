import { Grid, Avatar, Box, Container } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

export default function AboutTeamPanel({
  id,
  name,
  location,
  position,
  imageURL,
  description,
}: {
  id: number;
  name: string;
  location: string;
  position: string;
  imageURL: string;
  description: string;
}) {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid flexDirection={'row'}
    container
    item
    
    data-testid={`teamMemberContainer_${id}`}
    sx= {{
      width: isMatch? 150: '100%',
      flexWrap: 'wrap',
      display: 'flex',
      height: isMatch? 230:250,
    }}
    >
       
       <Box 
       sx={{
              display: 'flex',
              width: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              padding: 2,
              paddingBottom: 3,
              // borderRadius: 5,
              // border: 3,
              // borderColor: 'primary.main',
            }}
       >
        <Grid direction={'row'}
        sx={{
          
        }}>
        <Avatar 
              data-testid={`profileImage_${id}`}
              sx={{
                display: isMatch
                  ? { height: 70, width: 70 }
                  : { height: 120, width: 120 },
                  
              }}
              alt={name}
              src={imageURL}
            />
            <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>{name}</Box>
            <Box sx={{ fontWeight: 'Medium', marginBottom: 2 }}>{location}</Box>
            <Box sx={{ fontSize: '12px' }}>{position}</Box>
            </Grid> 
       </Box>
   
    </Grid>
    // <Grid
    //   data-testid={`teamMemberContainer_${id}`}
    //   container
    //   item
    //   md={6}
    //   sm={12}
    //   sx={{
    //     justifyContent: 'center',
    //     margin: 0,
    //   }}
    // >
    //   <Box
    //     sx={{
    //       display: 'inline-flex',
    //       width: 1,

    //       padding: 2,
    //       borderRadius: 5,
    //       border: 3,
    //       borderColor: 'primary.main',
    //     }}
    //   >
    //     <Grid container spacing={3}>
    //       <Grid item xs={isMatch ? 3 : 6} sx={{ justifyContent: 'center' }}>
    //         <Avatar
    //           data-testid={`profileImage_${id}`}
    //           sx={{
    //             display: isMatch
    //               ? { height: 100, width: 100 }
    //               : { height: 120, width: 120 },
    //           }}
    //           alt={name}
    //           src={imageURL}
    //         />
    //       </Grid>
    //       <Grid
    //         item
    //         xs={isMatch ? 12 : 6}
    //         sx={{
    //           display: 'inline-flex',
    //           // flexDirection: 'column',
    //           flexWrap: 'wrap',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>{name}</Box>
    //         <Box sx={{ fontWeight: 'Medium', marginBottom: 2 }}>{location}</Box>
    //         <Box sx={{ fontSize: '12px' }}>{position}</Box>
    //       </Grid>
    //       <Grid
    //         item
    //         xs={12}
    //         sx={{
    //           display: 'inline-flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <Box sx={{ fontSize: '12px', paddingTop: 3, minHeight: 130 }}>
    //           {description}
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </Grid>
  );
}
