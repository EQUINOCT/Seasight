import React, { useEffect, useState } from "react";
import { Button, Box, Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";

//Import Plots
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";
import DecadalMeanChart from "../Charts/DecadalMeanChart";
import FrequencyBarChart from "../Charts/FrequencyBarChart";
import BuiltUpAreaToThresholdChart from "../Charts/BuiltupAreaToThresholdChart";

type historicalChartTypes = 'monthlymean' | 'decadalmean' | 'monthwisedecadalmean';

// interface PanchayatAnalyticsScreenProps {
//   regionId: string;
//   setRegionId: (value: string) => void;
// }

// Previously impact-visualization screen in Insight Gather
const AnalyticsScreen: React.FC = () => {
  // const [startDate, setStartDate] = useState<Date | null>(new Date((new Date()).valueOf() - 2*1000*60*60*24));
  // const [endDate, setEndDate] = useState<Date | null>(new Date((new Date()).valueOf() + 2*1000*60*60*24));
  // const [loading, setLoading] = useState(true);
  // const [projected, setProjected]  = useState(false);
  // const [threshold, setThreshold]  = useState(false);
  const [historicalChartTypeSelect, setHistoricalChartTypeSelect] = useState<historicalChartTypes>('monthlymean');

  // const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

  const chartOptions:  {
    [key in historicalChartTypes]: {
        name: string;
        component: React.JSX.Element;
    };
  } = {
      monthlymean: {
        name: 'Monthly Mean',
        component: <HistoricalMeanChart />
      },
      decadalmean: {
        name: 'Decadal Means',
        component: <DecadalMeanChart />
      },
      monthwisedecadalmean: {
        name: 'Monthwise Decadal Means',
        component: <DecadalMeanChart />
      }
  };

  const handleToggle = (event: React.MouseEvent<HTMLElement>, historicalChartSelection: historicalChartTypes) => {
    if (historicalChartSelection!== null) {
      setHistoricalChartTypeSelect(historicalChartSelection);
    }
  }; 

  // Render the currently selected chart
  const renderChart = () => {
    return chartOptions[historicalChartTypeSelect].component;
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <ThemeProvider theme={theme}>
        {/* Top widgets */}
        
        <Grid size={{xs: 12}} container direction="column" spacing={1.5} sx={{ height: '100%', p: 1.5, pt: 0 }}>
          
          <Grid size={{xs: 12}} sx={{ height: '49%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}}>
              <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                <CardContent>
                  {/* <Typography  sx={{ fontSize: '18px', mb: 2, color: "#000"}}>Current Level</Typography> */}
                  <Grid size={{xs:12}} sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                    
                    <Grid size={{xs: 12, md: 3}}>
                      <Typography  sx={{ fontSize: '18px', color: '#000', mb: 2}}>Built Up Area VS Threshold Chart</Typography>
                    </Grid>
                    {BuiltUpAreaToThresholdChart({regionId: 'AR0006'})}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                 <CardContent>
                 <Typography  sx={{ fontSize: '18px', color: '#000', mb: 2}}>Calendar</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid size={{xs:12}} sx={{ height: '49%' }}>
            <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
              <CardContent>
                {/* <Typography sx={{ color: '#000', fontSize: '18px', mb: -0.1}}>Historic Mean Level</Typography>
                <Typography sx={{ color: '#488DA3', fontSize: '15px', mb: 2}}>Average tidal level</Typography>
                <HistoricalMeanChart/> */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography sx={{ fontSize: '18px', color: '#000' }}>
                    Frequency Chart
                  </Typography>
                  {FrequencyBarChart()}
                </Box>
                {/* {renderChart()} */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default AnalyticsScreen;
