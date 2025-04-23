import React, { useEffect, useState } from "react";
import { Button, Box, Card, CardContent, ThemeProvider, Typography, IconButton, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import WavesIcon from '@mui/icons-material/Waves';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

type Props = {
    selectedPanchayat: string;
  };

  const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const DayCardScroller = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const today= dayjs();
  
    const canGoRight = weekOffset < 0;      // can only go towards today if in the past
    const canGoLeft = weekOffset > -1;      // can only go back one week
  
    const startOfWeek = today.subtract(3, 'day').add(weekOffset * 7, 'day');
    
    //Connect data here to render actual high tide days
    const sampleHighTideDates = [
      dayjs('2025-04-07').format('YYYY-MM-DD'),
      dayjs('2025-04-09').format('YYYY-MM-DD'), 
      dayjs('2025-04-16').format('YYYY-MM-DD'), 
      dayjs('2025-04-17').format('YYYY-MM-DD'), 
      dayjs('2025-04-18').format('YYYY-MM-DD'), 
    ];
    
  
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.add(i, 'day');
      const isToday = date.isSame(today, 'day');
      const isHighTide = sampleHighTideDates.includes(date.format('YYYY-MM-DD'));
      return {
        label: daysShort[date.day()],
        // date: date.format('DD'),
        isToday,
        isHighTide
      };
    });
   
    return (
      <Stack 
        direction="row" 
        spacing={0.5} 
        alignItems="center" 
        justifyContent="center" 
        sx={{paddingBottom: 1.5, marginLeft: -1 }}
        >
        <IconButton 
          onClick={() => canGoLeft && setWeekOffset(weekOffset - 1)}
          sx={{ 
            color: '#000',
            width: '12px',
            height: '12px',
            padding: 0,
            paddingTop: 2,
            paddingRight: 0.5,
            opacity: canGoLeft ? 1 : 0.3,
            cursor: canGoLeft ? 'pointer' : 'not-allowed'
         }}>
          <ChevronLeft />
        </IconButton>
      
        {weekDays.map((day, idx) => (
          <Stack key={idx} spacing={0.5} alignItems="center">
            <Typography sx={{ fontSize: '10px', color: '#EBF9F5' }}>
              {day.label}
            </Typography>
            <Card
              sx={{
                color: '#97C7D6',
                backgroundColor: day.isToday ? "#EBF9F5" : "#656565",
                width: day.isToday ? '37px' : '40px',
                height: day.isToday ? '70px' : '56px',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: day.isToday ? '16px' : '14px',
                // color: day.isToday ? '#1B2D33' : '#97C7D6',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {/* {day.date} */}
              {day.isHighTide && <WavesIcon sx={{ paddingTop: 1 }}/>}
            </Card>
          </Stack>
        ))}
      
      <IconButton 
      onClick={() => canGoRight && setWeekOffset(weekOffset + 1)} 
      disabled={!canGoRight}
      sx={{ 
        color: '#000', 
        width: '12px', 
        height: '12px',
        padding: 0,
        paddingTop: 2,
        paddingLeft: 0.5,
        opacity: canGoRight ? 1 : 0.3,
      }}>
          <ChevronRight />
        </IconButton>
      </Stack>
    );
  };

  const ExpandedCalendar: React.FC<Props> = ({selectedPanchayat}) => {     
    
    return (
    <Card sx={{ 
            bgcolor: "#EBF9F5", 
            height: '100%', 
            }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: 0
            }}>
                <Typography sx={{ fontSize: '24px', color: '#000',  }}> {selectedPanchayat} Panchayat </Typography>
                <Typography sx={{  fontSize: '14px', color: '#000', mb: 2}}> Tidal Calendar </Typography>
                <DayCardScroller/>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: 7,
                    backgroundColor: 'rgba(72, 141, 163, 0.3)', // darker bluish tint with low opacity
                    paddingX: 0,
                    paddingBottom: -2,
                    marginTop: 1,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                    sx={{
                      '& .MuiPickersDay-root': {
                        color: '#488DA3',
                        fontWeight: 500,
                      },
                      '& .Mui-selected': {
                        bgcolor: '#488DA3 !important',
                        color: '#fff',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#000',
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#5E6664',
                        fontSize: '12px'
                      },
                      '& .MuiDayCalendar-slideTransition': {
                        marginBottom: 0, // key part
                        paddingBottom: 0,
                      },
                      '& .MuiDayCalendar-monthContainer': {
                        paddingBottom: 0,
                      },
                      '& .MuiDayCalendar-weekContainer': {
                        mb: 0,
                      }
                    }} />
                  </LocalizationProvider>
                </Box>
              <Typography sx={{ fontSize: '14px', color: '#000', mb: 2}}> Land Area Affected </Typography>
              <Grid container spacing={0.5} direction="row" size={{xs: 12}} sx={{ paddingX: '15px'}}>
                <Grid size={{ xs: 12, md: 4}}>
                  <Card sx={{
                    bgcolor: 'rgb(0,0,0, 0.5)',
                    color: '#fff',
                    borderRadius: '8px'
                  }}>
                    <CardContent sx={{
                      padding: '8px !important'
                    }}>
                      <Typography sx={{fontSize: '10px'}}>Urban</Typography>
                      <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '18px', marginRight: '1px' }}>35.4</span>
                            <span style={{ fontSize: '9px' }}>sq km</span>
                      </Typography> 
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4}}>
                  <Card sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: '#fff',
                      borderRadius: '8px',
                    }}>
                      <CardContent  sx={{
                      padding: '8px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start'
                    }}>
                        <Typography sx={{ fontSize: '10px'}}>Agriculture</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '18px', marginRight: '1px' }}>29.7</span>
                            <span style={{ fontSize: '9px' }}>sq km</span>
                        </Typography> 
                      </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4}}>
                  <Card sx={{
                      bgcolor: 'rgb(0, 0, 0, 0.5)',
                      color: '#fff',
                      borderRadius: '8px',
                    }}>
                      <CardContent  sx={{
                      padding: '8px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start'
                    }}>
                        <Typography sx={{fontSize: '10px'}}>Water</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '18px', marginRight: '1px' }}>88.8</span>
                            <span style={{ fontSize: '9px' }}>sq km</span>
                        </Typography> 
                      </CardContent>
                    </Card>
                </Grid>
            </Grid>   
          </CardContent>
    </Card>
)}

export default ExpandedCalendar;