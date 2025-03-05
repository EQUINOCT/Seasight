import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";
import { Map } from 'maplibre-gl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

//Import Plots
import RealtimeLineChart  from "../Charts/CurrentLevelChart";
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";
import ImpactMapComponent from "../Maps/ImpactMapComponent";

// Previously impact-visualization screen in Insight Gather
const ImpactScreen: React.FC = () => {
  const [map, setMap] = useState<Map>();
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string[]>(['Inundation']);
  const [tidalLevel, setTidalLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;
  console.log(dataServeUrl);

  useEffect(() => {
    fetch(`${dataServeUrl}/api/current-level`)
      .then(response => response.json())
      .then(data => {
        setTidalLevel(Number(data.level.toFixed(1)));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching current level:', error);
        setLoading(false);
      });
  }, [dataServeUrl]);

  
  return (
    <div className="w-full h-full relative bg-zinc-800 bg-opacity-98 flex flex-col overflow-hidden" style={{ height: '100vh' }}>
      <ThemeProvider theme={theme}>
        {/* Top widgets */}
        <Grid size={{xs: 12}} container direction="column" spacing={1.5} sx={{ height: '100%', p: 1.5, pt: '70px' }}>
          <Grid size={{xs: 12}} sx={{ height: '49%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}}>
              <Card sx={{ height: '100%'}}>
                <CardContent>
                  <Typography  sx={{ fontSize: '18px', mb: 2}}>Current Level</Typography>
                  <Grid size={{xs:12}} sx={{ display: 'flex', flexDirection: 'row', gap: 2}}>
                    
                    <Grid size={{xs: 12, md: 3}}>
                      {/* <Typography  sx={{ fontSize: '16px', mb: 2}}>Time Period</Typography> */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <DatePicker 
                        label="Start Date"
                        value={startDate ? dayjs(startDate) : null} 
                        onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                        slotProps={{
                          textField: {
                            sx: {
                              width: '200px',
                              svg: { color: '#fff' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#0081A7',
                                },
                              },
                            }
                          },
                          popper: {
                            sx: {
                              ".MuiPaper-root": { bgcolor: '#0081A7' },
                              mb: 2,
                            },
                          },
                        }}
                        //value={date}
                        //onChange={(newValue) => setDate(newValue)}
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
                              svg: { color: '#fff' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#0081A7',
                                },
                              },
                            }
                          },
                          popper: {
                            sx: {
                              ".MuiPaper-root": { bgcolor: '#0081A7' },
                            },
                          },
                        }}
                        />
                        </Box>
                      </LocalizationProvider>
                    </Grid>
                    <Grid size={{xs: 12, md: 9}}>
                      <RealtimeLineChart/>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ height: '100%'}}>
                 {/* <CardContent> */}
                <ImpactMapComponent
                  map={map}
                  setMap={setMap}
                  selectedLayer = {selectedLayer}
                  tidalLevel = {tidalLevel}
                />
                {/* </CardContent> */}
              </Card>
            </Grid>
          </Grid>
          <Grid size={{xs:12}} sx={{ height: '49%' }}>
            <Card sx={{ height: '100%'}}>
              <CardContent>
                <Typography sx={{ fontSize: '18px', mb: 2}}>Historic Data</Typography>
                <HistoricalMeanChart/>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default ImpactScreen;
