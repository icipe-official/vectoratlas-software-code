import { Container } from "@mui/material";
import React from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

function DataHubPanel(props: any) {
  return (
    <div>
      <main>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <div>Welcome ! What operation do you want to perform ?</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} md={6}>
              <h3
                color="primary"
                style={{ textAlign: "center", marginBottom: 0 }}
              >
                Upload Model
              </h3>
              <div
                data-testid="upload_model"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginTop: 15 }}>
                  <Link href="/model_upload" passHref>
                    <Image
                      src="/upload.png"
                      width={100}
                      height={100}
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                </div>
              </div>
            </Grid>
            <Grid item sm={12} md={6}>
              <h3
                color="primary"
                style={{ textAlign: "center", marginBottom: 0 }}
              >
                Upload Data
              </h3>
              <div
                data-testid="upload_data"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginTop: 15 }}>
                  <Link href="/upload" passHref>
                    <Image
                      src="/upload2.png"
                      width={100}
                      height={100}
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default DataHubPanel;
