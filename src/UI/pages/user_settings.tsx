import { Avatar, Container } from "@mui/material";
import React from "react";
import SectionPanel from "../components/layout/sectionPanel";
import { useUser } from "@auth0/nextjs-auth0";
import { useAppSelector } from "../state/hooks";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Grid, TextField } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useEffect } from "react";
import { useRouter } from "next/router";

function UserSettings() {
  const { user, isLoading } = useUser();
  const userRoles = useAppSelector((state) => state.auth.roles);
  const isLoadingRoles = useAppSelector((state) => state.auth.isLoading);

  const router = useRouter();
  const backHome = () => router.push("./");

  useEffect(() => {
    if (!user?.nickname && !isLoading) {
      router.push("/api/auth/login");
    }
  }, [user, isLoading, router]);

  if (user) {
    return (
      <div>
        <main>
          <Container
            sx={{
              padding: "10px",
              maxWidth: "75%",
            }}
          >
            <SectionPanel title="User's Settings">
              {/* <AuthWrapper role="">
                            <div>
                                Welcome to vector atlas
                            </div>
                        </AuthWrapper> */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <div>
                        Welcome <b>{user?.nickname}</b> !
                      </div>
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                                        <Box sx={{ "& > :not(style)": { m: 1 } }}>
                                            <Fab color="primary" aria-label="edit">
                                                <EditIcon />
                                            </Fab>
                                            <Fab color="error" aria-label="add">
                                                <DeleteForeverIcon />
                                            </Fab>
                                        </Box>
                                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid item sm={12} md={6}>
                  <div>
                    <h4 color="primary">Personal information</h4>
                    <div style={{ marginTop: 30 }}>
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={user?.name}
                        fullWidth={true}
                      />
                    </div>
                    <div style={{ marginTop: 30 }}>
                      <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={user?.email}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item sm={12} md={6}>
                  <div>
                    <h4 color="primary">Access information</h4>
                    <div>
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        {userRoles.map((role) => {
                          return (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <LockOpenIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={role} />
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </SectionPanel>
          </Container>
        </main>
      </div>
    );
  } else {
    return <div>Hello World !</div>;
  }
}

export default UserSettings;
