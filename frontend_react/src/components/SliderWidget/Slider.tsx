import * as React from 'react';
import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useConfig } from '../../ConfigContext';
import Grid from '@mui/material/Grid2';
import MinimalRealtimeLevelChart from '../Charts/MinimalRealtimeLevelChart.js';
import TideCard from '../TideCard/TideCard';

const min = 0.7;
const max = 2.2;
const step = 0.1;
const MSL = 0.8;

const marks = Array.from({ length: (max - min) / step + 1 }, (_, index) => ({
  value: min + index * step,
  label: index === 0 || index === (max - min) / step ? `${min + index * step}m - MSL` : undefined,
}))

function valuetext(value: number) {
  return `${value}m`;
}

interface SliderWidgetProps {
  tidalLevel: number;
  setTidalLevel: (value: number) => void;
  timeStampAtLevel: Date;
  selectedDate: Date,
  loading: boolean;
}

const SliderWidget: React.FC<SliderWidgetProps> = ({ tidalLevel, setTidalLevel, timeStampAtLevel, selectedDate, loading }) => {

  // Calculate the height percentage based on current value
  const getTrackHeight = () => {
    const min = 1;
    const max = 2;
    const percentage = ((tidalLevel - min) / (max - min)) * 100;
    return `${percentage}%`;
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setTidalLevel(newValue as number); // Update tidalLevel when slider changes
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '300px',
        height: '100%',
        backgroundColor: 'rgb(0, 0, 0, 0.8)',
        borderRadius: '15px'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start',
        width: '75px',
        height: '355px',
        borderRadius: '12px',
        backgroundColor: 'rgb(24,24,27,0.99)',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px'
      }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            p: 1,
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex' }}>
            <Typography sx={{ fontSize: 14, color: '#fff', ml: -1, mb: 0.75 }}>Tidal Gauge</Typography>
            {/* <Typography sx={{fontSize: '10px', color: '#fff',opacity: '70%', ml: 0.5, mt: 1.75}}>{'(Above Mean Sea Level)'}</Typography> */}
          </div>
          <Slider
            aria-label="Restricted values"
            defaultValue={tidalLevel}
            onChange={handleSliderChange}
            getAriaValueText={valuetext}
            orientation="vertical"
            valueLabelDisplay="on"
            marks={marks}
            step={step}
            min={min}
            max={max}
            sx={{
              color: '#61B3FF', // Change the slider color if needed
              height: '90%',
              width: '20%',
              mt: 1,
              '& .MuiSlider-thumb': {
                backgroundColor: '#fff', // Color of the thumb
              },
              '& .MuiSlider-track': {
                style: {
                  height: getTrackHeight(),
                  bottom: 0
                },
                backgroundColor: '#61B3FF', // Color of the track
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#61B3FF', // Color of the rail
              },
              '& .MuiSlider-markLabel': {
                color: '#fff',
                fontSize: '12px',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '10%', // Position it just outside the slider
            top: `${((max - MSL) / (max - min)) * 100}%`, // Position based on MSL
            transform: 'translateY(50%)',
            display: 'flex',
            alignItems: 'center',
            ml: 1
          }}
        >
          <Box
            sx={{
              width: '25px',
              height: '1px',
              borderBottom: '1px dotted #fff',
              mr: 0.25
            }}
          />
          <Typography sx={{ fontSize: '10px', color: '#fff' }}>MSL</Typography>
        </Box>
      </div>
      <div style={{
        // background: '#fff000',
        // opacity: '30%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        overflowWrap: 'break-word', // Allow long words to break
        wordWrap: 'break-word', // Fallback for older browsers
        padding: '20px',
        paddingTop: '12px',
        gap: '5px',
        textAlign: 'center',
        color: '#ebebeb'
      }}>
        <Typography sx={{ fontSize: '15px', alignSelf: 'start'}}>Current Level</Typography>
        <MinimalRealtimeLevelChart
          tidalLevel={tidalLevel}
          timeStampAtLevel={timeStampAtLevel}
          selectedDate={selectedDate}
        />
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', padding: 0}}>
          <Typography sx={{ fontSize: '15px'}}>Tidal level: {tidalLevel} m </Typography>
          <Typography sx={{ fontSize: '12px'}}>
            {timeStampAtLevel.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}, {timeStampAtLevel.toLocaleTimeString('en-IN', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZone: 'Asia/Kolkata'
            }).toUpperCase()} IST
          </Typography>          
        </Grid>
        <Grid sx={{justifyContent: 'center'}}>
          <TideCard/>
        </Grid>
      </div>
    </Box>
  );
};

export default SliderWidget;