import React, { useState } from "react";
import HighlightComponent from "../BasinHighlights/HighlightComponent";
import ButtonComponent from "../LevelNav/ImpactButtons";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import Slider from "../SliderWidget/Slider";
import { Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";

//Import Plots
import RealtimeLineChart  from "../Charts/CurrentLevelChart";
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";

// Previously impact-visualization screen in Insight Gather
const ImpactScreen: React.FC = () => {
  
  return (
    <div className="monitor-screen w-full h-full relative bg-white flex flex-col rounded-[15px] overflow-hidden">
      <ThemeProvider theme={theme}>
        {/* Top widgets */}
        <Grid size={{xs: 12}} container direction="column" spacing={1.5} sx={{ height: '100%', p: 1.5, pt: '70px' }}>
          <Grid size={{xs: 12}} sx={{ height: '49%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography>Current Level</Typography>
                  <RealtimeLineChart/>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography>Map</Typography>
                  {/* </> */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid size={{xs:12}} sx={{ height: '49%' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography>Historic Data</Typography>
                <HistoricalMeanChart/>
              </CardContent>

            </Card>
          </Grid>
        </Grid>

        {/* Right Side Stats */}
        {/* <Grid size={{xs: 12, md: 8}} container direction="column" spacing={1} sx={{ height: '100%' }}> */}
          {/* Current Station Cards */}
          
            {/* <Grid sx={{ height: '80%', display: 'flex', flexDirection: 'column' }}>
                <Card sx={{ flexGrow: 1, height: '50%'}}>
                <CardContent>
                    <Typography >Tidal Station Data</Typography>
                </CardContent>
                </Card>
                <Card sx={{ flexGrow: 1, mt: 1, height: '50%' }}>
                <CardContent>
                    <Typography >Thunacadavu Regulator</Typography>
                </CardContent>
                </Card>
            </Grid> */}
            

          {/* Basin Details */}
          {/* <Grid sx={{ height: '18%' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography>Basin Details</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid> */}
    </ThemeProvider>
    </div>
  );
};

export default ImpactScreen;
