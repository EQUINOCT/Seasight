import React, { useState } from "react";
import HighlightComponent from "../BasinHighlights/HighlightComponent";
import ButtonComponent from "../LevelNav/ImpactButtons";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import { addBoundaryLayer, removeBoundaryLayer } from "../../layers/PolygonLayer";
import Slider from "../SliderWidget/Slider";
import { Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";

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
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography>Map</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid size={{xs:12}} sx={{ height: '49%' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>Historic Data</CardContent>
            </Card>
          </Grid>
        </Grid>
    </ThemeProvider>
    </div>
  );
};

export default ImpactScreen;
