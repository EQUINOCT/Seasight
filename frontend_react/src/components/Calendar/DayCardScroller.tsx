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
const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

interface DayCardScrollerProps {
  regionId: string
}

const DayCardScroller: React.FC<DayCardScrollerProps> = ({regionId}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const today= dayjs();

  const canGoRight = weekOffset < 0;      // can only go towards today if in the past
  const canGoLeft = weekOffset > -1;      // can only go back one week

  const startOfWeek = today.subtract(3, 'day').add(weekOffset * 7, 'day');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState<string[]>(['']);

  useEffect(() => {
      fetchTidalFloodDaysData("/api/daily-peak-data/flood-days", regionId, '2025-04-22', '2025-04-28');
      
  }, [dataServeUrl, regionId]);

  
  const fetchTidalFloodDaysData = async (endPoint: string, regionId: string, startDate: string, endDate: string ) => {
    setLoading(true);

    try {        

      // const startDateStr: string = startDate.toISOString();
      // const endDateStr: string = endDate.toISOString();
      const response = await axios.get(`${dataServeUrl}${endPoint}`, {
          params: {
              region_id: regionId,
              start_date: startDate,
              end_date: endDate
          }
      });    
    
    const data = response.data;
    setData(data);
    } catch (error) {
    console.error('Error fetching analytics data:', error);
    } finally {
    setLoading(false);
    }
  }


  //Connect data here to render actual high tide days
  // const sampleHighTideDates = [
  //   dayjs('2025-04-07').format('YYYY-MM-DD'),
  //   dayjs('2025-04-09').format('YYYY-MM-DD'), 
  //   dayjs('2025-04-16').format('YYYY-MM-DD'), 
  //   dayjs('2025-04-17').format('YYYY-MM-DD'), 
  //   dayjs('2025-04-18').format('YYYY-MM-DD'), 
  // ];

  console.log(data);
  

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = startOfWeek.add(i, 'day');
    const isToday = date.isSame(today, 'day');
    const isHighTide = data.includes(date.format('YYYY-MM-DD'));
    return {
      label: daysShort[date.day()],
      // date: date.format('DD'),
      isToday,
      isHighTide
    };
  });
 
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ paddingX: '5px', paddingBottom: 1.5 }} >
      {/* <IconButton 
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
      </IconButton> */}
    
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

export default DayCardScroller;