import React, { useEffect, useState } from "react";
import axios from 'axios';
import Draggable from "react-draggable";
import Stack from '@mui/material/Stack';
import { Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import WavesIcon from '@mui/icons-material/Waves';

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
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ paddingX: '5px', paddingBottom: 1.5 }} >
      <IconButton 
        onClick={() => canGoLeft && setWeekOffset(weekOffset - 1)}
        sx={{ 
          color: '#fff',
          width: '10px',
          height: '10px',
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
              width: day.isToday ? '40px' : '32px',
              height: day.isToday ? '55px' : '50px',
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
      color: '#fff', 
      width: '10px', 
      height: '10px',
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

interface CalendarWidgetProps {
  regionId: string;
  tidalLevel: number;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({regionId, tidalLevel}) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

  useEffect(() => {
        fetchData('/api/analytics/realtime-data/monthwise/frequency-means', regionId, tidalLevel);
    }, [dataServeUrl]);

  const fetchData = async (endPoint: string, regionId: string, tidalLevel: number) => {
      setLoading(true);
      try {
          
          const response = await axios.get(`${dataServeUrl}${endPoint}`, {
              params: {
                  region_id: regionId,
                  tidal_level: tidalLevel
              }
      });

      setData(response.data);
      } catch (error) {
      console.error('Error fetching analytics data:', error);
      } finally {
      setLoading(false);
      }
  };

  return (
  <Draggable>
   <section className="flex flex-col text-white font-inter rounded-[18px] w-[300px] max-w-[300px] p-0 m-0 min-h-0 h-auto leading-tight overflow-hidden">
      <div className={`flex flex-col pb-4 rounded-[18px] bg-zinc-900 bg-opacity-90`}>
        {/* <header className={`flex flex-col pt-3.5 w-full ${isCollapsed ? "bg-transparent" : "rounded-[22px_22px_1px_1px] bg-zinc-800 bg-opacity-80 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"}`}> */}
            <div className="pl-[15px] pt-5 pb-1.5 text-[16px] leading-none">
             Ezhikkara Panchayat
            </div>
        <Typography sx={{fontSize: '14px', paddingLeft: '15px', paddingBottom: 1.5, color: '#EBF9F5'}}> Tidal Calendar </Typography>      
            <DayCardScroller />

        <Typography sx={{fonSize: '14px', paddingLeft: '15px', paddingBottom: 1, color: '#EBF9F5'}}> Land Area Affected </Typography>   
          <Grid container spacing={0.5} direction="row" size={{xs: 12}} sx={{ paddingX: '15px'}}>
              <Grid size={{ xs: 12, md: 4}}>
                <Card sx={{
                  bgcolor: 'rgb(0,0,0, 0.3)',
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
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
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
                    bgcolor: 'rgb(0, 0, 0, 0.3)',
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
      </div>
    </section>
  </Draggable>
  );
};

export default CalendarWidget;