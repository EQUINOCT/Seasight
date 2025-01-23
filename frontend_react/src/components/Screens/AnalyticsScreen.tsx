import React, { useState } from "react";
import { Card, CardContent, ThemeProvider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import theme from "../theme";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

//Import Plots
import RealtimeLineChart  from "../Charts/CurrentLevelChart";
import HistoricalMeanChart  from "../Charts/HistoricalMeanChart";

// Previously impact-visualization screen in Insight Gather
const ImpactScreen: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  
  return (
    <div className="w-full h-full relative bg-white flex flex-col rounded-[15px] overflow-hidden" style={{ height: '100vh' }}>
      <ThemeProvider theme={theme}>
        {/* Top widgets */}
        <Grid size={{xs: 12}} container direction="column" spacing={1.5} sx={{ height: '100%', p: 1.5, pt: '70px' }}>
          <Grid size={{xs: 12}} sx={{ height: '49%', display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Grid size={{xs: 12, md: 9}}>
              <Card sx={{ height: '100%', opacity: '90%'}}>
                <CardContent>
                  <Typography  sx={{ fontSize: '18px', mb: 2}}>Current Level</Typography>
                  <Grid size={{xs:12}} sx={{ display: 'flex', flexDirection: 'row', gap: 2}}>
                    <Grid size={{xs: 12, md: 9}}>
                      <RealtimeLineChart/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                      <Typography  sx={{ fontSize: '16px', mb: 2}}>Time Period</Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            borderColor: '#fff',
                          },
                        },
                      }
                    },
                    popper: {
                      sx: {
                        ".MuiPaper-root": { bgcolor: '#AED697' },
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
                  slotProps={{
                    textField: {
                      sx: {
                        width: '200px',
                        svg: { color: '#fff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#fff',
                          },
                        },
                      }
                    },
                    popper: {
                      sx: {
                        ".MuiPaper-root": { bgcolor: '#AED697' },
                      },
                    },
                  }}
                  />
                </LocalizationProvider>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Card sx={{ height: '100%', opacity: '90%' }}>
                <CardContent>
                  {/* <Typography>Map</Typography> */}
                  {/* </> */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid size={{xs:12}} sx={{ height: '49%' }}>
            <Card sx={{ height: '100%', opacity: '90%'}}>
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
