import React, { useEffect, useState } from "react";
import { Button, Box, Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";

//Import Plots
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";
import DecadalMeanChart from "../Charts/DecadalMeanChart";
import FrequencyBarChart from "../Charts/FrequencyBarChart";
import BuiltUpAreaToThresholdChart from "../Charts/BuiltupAreaToThresholdChart";
import ExpandedCalendar from "../Calendar/ExpandedCalendar";

type historicalChartTypes = 'monthlymean' | 'decadalmean' | 'monthwisedecadalmean';

type Props = {
  selectedPanchayat: string;
};

// Previously impact-visualization screen in Insight Gather
const AnalyticsScreen: React.FC<Props> = ({selectedPanchayat}) => {
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
        
        <Grid size={{xs: 12}} container spacing={1.5} sx={{ height: '100%', p: 1.5, pt: 0 }}>
          
          <Grid size={{xs: 12}} sx={{ height: '100%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/*C1*/}
              <Grid size={{xs:12}} sx={{ height: '49%' }}>
                <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1}}>
                    {/* <Typography  sx={{ fontSize: '18px', mb: 2, color: "#000"}}>Current Level</Typography> */}                  
                        <Typography  
                        sx={{ 
                          fontSize: '18px', 
                          color: '#000', 
                          mb: 1
                        }}>
                          Frequency Area Chart
                        </Typography>
                        <Grid size={{xs: 12}} style={{ display: 'flex', flexDirection: 'row', gap: 2}}>
                          <Grid size={{xs: 12, md: 8}}>
                          {BuiltUpAreaToThresholdChart({regionId: 'AR0005'})}
                          </Grid>
                          <Grid size={{xs: 12, md: 4}} style={{marginLeft: '50px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography 
                            sx={{
                              fontSize: '16px', 
                              color: '#000', 
                              mb: 2
                            }}>
                              Information
                            </Typography>
                            <Typography 
                            sx={{
                              fontSize: '12px', 
                              color: '#000', 
                              mb: 2
                            }}>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Typography>
                          </Grid>
                        </Grid>
                  </CardContent>
                </Card>
              </Grid>
               {/*C3*/}
              <Grid size={{xs: 12}} sx={{ height: '50%', display: 'flex', flexDirection: 'row', gap: 1}}>
                <Grid size={{xs: 12, md: 6}}>
                  <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                    <CardContent>
                      {/* <Typography sx={{ color: '#000', fontSize: '18px', mb: -0.1}}>Historic Mean Level</Typography>
                      <Typography sx={{ color: '#488DA3', fontSize: '15px', mb: 2}}>Average tidal level</Typography>
                      <HistoricalMeanChart/> */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'start',
                          gap: 1,
                          mb: 1
                        }}
                      >
                        <Typography sx={{ fontSize: '18px', color: '#000', whiteSpace: 'nowrap' }}>
                          Average Flooded Days
                        </Typography>
                        {FrequencyBarChart()}
                      </Box>
                      {/* {renderChart()} */}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs: 12, md: 6}} sx={{height: '100%'}}>
                  <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                    <CardContent>
                      {/* <Typography sx={{ color: '#000', fontSize: '18px', mb: -0.1}}>Historic Mean Level</Typography>
                      <Typography sx={{ color: '#488DA3', fontSize: '15px', mb: 2}}>Average tidal level</Typography>
                      <HistoricalMeanChart/> */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'start',
                          gap: 1,
                          mb: 2
                        }}
                      >
                        <Typography sx={{ fontSize: '18px', color: '#000', whiteSpace: 'nowrap' }}>
                          Month-wise
                        </Typography>
                      </Box>
                      {/* {renderChart()} */}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

             {/*C2*/}
            <Grid size={{xs: 12, md: 3}}>
              <ExpandedCalendar selectedPanchayat={selectedPanchayat}/>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default AnalyticsScreen;
