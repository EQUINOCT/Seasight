import React, { useEffect, useState } from "react";
import { Button, Box, Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";
import { Map } from 'maplibre-gl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';


//Import Plots
import RealtimeAnalytics  from "../Charts/CurrentLevelChart";
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";
import DecadalMeanChart from "../Charts/DecadalMeanChart";
import AnalyticsMapWidgetComponent from "../Maps/AnalyticsMapWidgetComponent";
import { getPickersCalendarHeaderUtilityClass } from "@mui/x-date-pickers/PickersCalendarHeader/pickersCalendarHeaderClasses";

type historicalChartTypes = 'monthlymean' | 'decadalmean' | 'monthwisedecadalmean';

// Previously impact-visualization screen in Insight Gather
const AnalyticsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date((new Date()).valueOf() - 2*1000*60*60*24));
  const [endDate, setEndDate] = useState<Date | null>(new Date((new Date()).valueOf() + 2*1000*60*60*24));
  const [loading, setLoading] = useState(true);
  const [projected, setProjected]  = useState(false);
  const [threshold, setThreshold]  = useState(false);
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
    <div className="w-full h-full relative bg-zinc-800 bg-opacity-98 flex flex-col overflow-hidden" style={{ height: '100vh' }}>
      <ThemeProvider theme={theme}>
        {/* Top widgets */}
        <Grid size={{xs: 12}} container direction="column" spacing={1.5} sx={{ height: '100%', p: 1.5, pt: '70px' }}>
          <Grid size={{xs: 12}} sx={{ height: '49%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}}>
              <Card sx={{ bgcolor: "#EBF9F5", height: '100%'}}>
                <CardContent>
                  {/* <Typography  sx={{ fontSize: '18px', mb: 2, color: "#000"}}>Current Level</Typography> */}
                  <Grid size={{xs:12}} sx={{ display: 'flex', flexDirection: 'row', gap: 2}}>
                    
                    <Grid size={{xs: 12, md: 3}}>
                      <Typography  sx={{ fontSize: '18px', color: '#000', mb: 2}}>Real-Time Levels</Typography>
                     
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <DatePicker 
                        label="Start Date"
                        value={startDate ? dayjs(startDate) : null} 
                        onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                        slotProps={{
                          textField: {
                            sx: {
                              // backgroundColor: '#488DA3', 
                              width: '200px',
                              color: '#488DA3',
                              svg: { color: '#488DA3' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#488DA3',
                                  borderRadius: '10px',
                                },
                                '&.Mui-focused fieldset': { borderColor: '#488DA3' },
                                '&:hover fieldset': { borderColor: '#000' },
                              },
                            }
                          },
                          popper: {
                            sx: {
                              ".MuiPaper-root": { bgcolor: '#488DA3' },
                              mb: 2,
                            },
                          },
                        }}
                        />
                        <DatePicker 
                        label="End Date"
                        value={endDate ? dayjs(endDate) : null}
                        onChange={(newValue) => setEndDate(newValue? newValue.toDate() : null)}
                        minDate={startDate ? dayjs(startDate) : undefined} 
                        slotProps={{
                          textField: {
                          
                            sx: {
                              width: '200px',
                              svg: { color: '#488DA3' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#488DA3',
                                  borderRadius: '10px',
                                },
                                '&.Mui-focused fieldset': { borderColor: '#488DA3' },
                                '&:hover fieldset': { borderColor: '#000' },
                              },
                            }
                          },
                          popper: {
                            sx: {
                              ".MuiPaper-root": { bgcolor: '#488DA3' },
                            },
                          },
                        }}
                        />
                        </Box>
                      </LocalizationProvider>
                    </Grid>
                    
                    <Grid size={{xs: 12, md: 9}}>
                    <Grid 
                      container 
                      spacing={1} 
                      justifyContent="flex-end" 
                      alignItems="center" // Ensures buttons align properly
                      sx={{ mb: -2 }} // Keeps your existing negative margin
                    >
                        <Button 
                          sx={{ 
                            fontSize: '12px',
                            textTransform: 'none', 
                            borderColor: '#488DA3', 
                            bgcolor: projected? '#488DA3':'#fff',
                            color: projected? '#fff':'#488DA3', 
                            borderWidth: '1px', 
                            width: '80px',
                            height: '25px',
                          }}
                          onClick={() => setProjected (!projected)} 
                          >
                            Projection
                          </Button>
                          <Button 
                          sx={{ 
                            fontSize: '12px',
                            textTransform: 'none', 
                            borderColor: '#488DA3', 
                            bgcolor: threshold? '#488DA3':'#fff',
                            color: threshold? '#fff':'#488DA3', 
                            borderWidth: '1px', 
                            width: '80px',
                            height: '25px',
                          }}
                          onClick={() => setThreshold (!threshold)} 
                          >
                            Threshold
                          </Button>
                        </Grid>
                        <RealtimeAnalytics
                          startDate={startDate}
                          endDate={endDate}
                          projected={projected}
                        />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ height: '100%'}}>
                 {/* <CardContent> */}
                <AnalyticsMapWidgetComponent
                />
                {/* </CardContent> */}
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
                    Historic Data
                  </Typography>
                  <ToggleButtonGroup
                    value={historicalChartTypeSelect}
                    exclusive
                    onChange={handleToggle}
                    sx={{
                      backgroundColor: '#fff', // Background color of the group
                      '& .MuiToggleButton-root': {
                        paddingY: 0.5,
                        paddingX: 1,
                        color: '#488DA3', // Default text color
                        borderColor: '#488DA3', // Default border color
                        '&.Mui-selected': {
                            backgroundColor: '#488DA3', // Color when selected
                            color: '#fff', // Text color when selected
                            '&:hover': {
                                backgroundColor: '#32778C', // Darker color on hover when selected
                            },
                        },
                    },
                    }}
                    >
                      <ToggleButton value="monthlymean" sx={{textTransform: 'none'}}>Monthly Means</ToggleButton>
                      <ToggleButton value="decadalmean" 
                        sx={{ 
                          textTransform: 'none', 
                          color: '#488DA3', // Default color
                          '&.Mui-selected': {
                            color: '#fff', // Text color when selected
                          }
                        }}
                      >
                        Decadal Means
                      </ToggleButton>
                      {/* <ToggleButton value="monthwisedecadalmean">Monthwise Decadal Means</ToggleButton> */}
                  </ToggleButtonGroup>
                </Box>
                {renderChart()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default AnalyticsScreen;
