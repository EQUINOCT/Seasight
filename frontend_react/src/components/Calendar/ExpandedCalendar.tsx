import React, { useEffect, useState } from "react";
import { Button, Box, Card, CardContent, ThemeProvider, Typography, IconButton, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import WavesIcon from '@mui/icons-material/Waves';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';


type Props = {
    selectedPanchayat: string;
  };

  const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const DayCardScroller = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const today = dayjs();
  
    const canGoRight = weekOffset < 0;
    const canGoLeft = weekOffset > -1;
  
    const startOfWeek = today.subtract(3, 'day').add(weekOffset * 7, 'day');
  
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
        date: date.format('DD'),
        isToday,
        isHighTide,
      };
    });
  
    return (
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
        sx={{
          overflowX: 'auto',
          overflowY: 'visible',
          width: '100%',
          maxWidth: '100%',
          '&::-webkit-scrollbar': { display: 'none' }, // optional: hide scrollbar
        }}
      >
        <IconButton
          onClick={() => canGoLeft && setWeekOffset(weekOffset - 1)}
          sx={{
            color: '#000',
            width: '12px',
            height: '12px',
            padding: 0,
            pt: 2,
            pr: 0.5,
            opacity: canGoLeft ? 1 : 0.3,
            cursor: canGoLeft ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          <ChevronLeft />
        </IconButton>
  
        {weekDays.map((day, idx) => (
          <Stack key={idx} spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: '10px', color: '#5E6664' }}>
              {day.label}
            </Typography>
            <Card
              sx={{
                width: 38,
                height: 56,
                borderRadius: '8px',
                bgcolor: day.isToday ? '#488DA3' : '#D6F0EA', // subtle contrast for non-today days
                color: day.isToday ? '#fff' : '#488DA3',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: day.isToday ? '16px' : '14px',
                fontWeight: day.isToday ? 600 : 500,
                boxShadow: day.isToday ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {/* <Typography>{day.date}</Typography> */}
              {day.isHighTide && (
                <WavesIcon sx={{ color: '#54BEBE' }} />
              )}
            </Card>
          </Stack>
        ))}
  
        <IconButton
          onClick={() => canGoRight && setWeekOffset(weekOffset + 1)}
          sx={{
            color: '#000',
            width: '12px',
            height: '12px',
            padding: 0,
            pt: 2,
            pl: 0.5,
            opacity: canGoRight ? 1 : 0.3,
            cursor: canGoRight ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>
    );
  };
  
  const sampleHighTideDates: Record<string, number>  = {
    '2025-04-07': 2.3,
    '2025-04-09': 1.9,
    '2025-04-16': 2.5,
    '2025-04-17': 2.1,
    '2025-04-18': 2.4,
  };

  const ExpandedCalendar: React.FC<Props> = ({selectedPanchayat}) => {     
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

    const CustomDay = (props: PickersDayProps<Dayjs>) => {
      const { day, outsideCurrentMonth, ...other } = props;
    
      const formatted = day.format('YYYY-MM-DD');
      const isHighTide = Object.keys(sampleHighTideDates).includes(formatted);

    
      return (
        <Box
          sx={{
            borderRadius: '50%',
            border: isHighTide ? '1.5px solid #003554' : '1px solid transparent',
            padding: '0.5px',
          }}
        >
          <PickersDay
            {...props}
            disableMargin
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
          />
        </Box>
      );
    };
    
    
    return (
    <Card sx={{ 
            bgcolor: "#EBF9F5", 
            height: '100%', 
            }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: 1.5
            }}>
                <Typography sx={{ fontSize: '24px', color: '#2B4A54', mb: -1.5}}> {selectedPanchayat} Panchayat </Typography>
                <Typography sx={{  fontSize: '14px', color: '#2B4A54'}}> Tidal Calendar </Typography>
                <DayCardScroller/>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    width: '100%',
                    borderRadius: 7,
                    backgroundColor: '#488DA3', // darker bluish tint with low opacity
                    paddingX: 0,
                    paddingBottom: -2,
                    marginTop: 1,
                  }}
                >
                  <Typography sx={{ fontSize: '19px', fontWeight: 500, color: '#fff', marginTop: 2, marginLeft: 3, marginBottom: -1, justifyContent: 'start' }}>
                    {selectedDate ? selectedDate.format("Do MMMM YYYY") : ""}
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slots={{ day: CustomDay }}
                    sx={{
                      '& .MuiPickersDay-root': {
                        color: '#EBF9F5',
                        fontWeight: 500,
                        fontSize: '14px'
                      },
                      '& .Mui-selected': {
                        bgcolor: '#003554 !important',
                        // color: '#488DA3 !important',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#2B4A54',
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
              <Typography sx={{ fontSize: '14px', color: '#2B4A54'}}> Land Area Affected </Typography>
              <Grid container spacing={0.5} direction="row" size={{xs: 12}} sx={{height: '100%'}}>
                <Grid size={{ xs: 12, md: 4}} sx={{height: '100%'}}>
                  <Card sx={{
                    bgcolor: 'rgba(72, 141, 163, 0.3)',
                    color: '#2B4A54',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    height: '100%'
                  }}>
                    <CardContent sx={{
                      padding: '8px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      gap: 2,
                    }}>
                      <Typography sx={{fontSize: '12px'}}>Urban</Typography>
                      <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '20px', marginRight: '1px' }}>35.4</span>
                            <span style={{ fontSize: '12px' }}>sq km</span>
                      </Typography> 
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4}} sx={{height: '100%'}}>
                  <Card sx={{
                      bgcolor: 'rgba(72, 141, 163, 0.3)',
                      color: '#2B4A54',
                      borderRadius: '8px',
                      boxShadow: 'none'
                    }}>
                      <CardContent  sx={{
                      padding: '8px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      gap: 2,
                    }}>
                        <Typography sx={{ fontSize: '12px'}}>Agriculture</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '20px', marginRight: '1px' }}>29.7</span>
                            <span style={{ fontSize: '12px' }}>sq km</span>
                        </Typography> 
                      </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4}} sx={{height: '100%'}}>
                  <Card sx={{
                      bgcolor: 'rgba(72, 141, 163, 0.3)',
                      height: '100%',
                      color: '#2B4A54',
                      borderRadius: '8px',
                      boxShadow: 'none'
                    }}>
                      <CardContent  sx={{
                      padding: '8px !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      gap: 2,
                      justifyContent: 'space-between'
                    }}>
                        <Typography sx={{fontSize: '12px'}}>Water</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '20px', marginRight: '1px' }}>88.8</span>
                            <span style={{ fontSize: '12px' }}>sq km</span>
                        </Typography> 
                      </CardContent>
                    </Card>
                </Grid>
            </Grid>   
          </CardContent>
    </Card>
)}

export default ExpandedCalendar;