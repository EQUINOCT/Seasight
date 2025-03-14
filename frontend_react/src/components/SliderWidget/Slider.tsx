import * as React from 'react';
import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import { Box, Typography } from '@mui/material';
import { useConfig } from '../../ConfigContext';
import MinimalRealtimeLevelChart from '../Charts/MinimalRealtimeLevelChart.js';



const min = 0.5;
const max = 2.0;
const step = 0.1;

const marks = Array.from({ length: (max - min) / step + 1 }, (_, index) => ({
  value: min + index * step,
  label: index === 0 || index === (max - min) / step ? `${min + index * step}m` : undefined,
}))

function valuetext(value: number) {
  return `${value}m`;
}

interface SliderWidgetProps {
  tidalLevel: number;
  setTidalLevel: (value: number) => void;
  selectedDate: Date,
  loading: boolean;
}

const SliderWidget: React.FC<SliderWidgetProps> = ({ tidalLevel, setTidalLevel, selectedDate, loading }) => {


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
  console.log('slider', selectedDate)
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
      </div>
      <div style={{
        // background: '#fff000',
        // opacity: '30%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowWrap: 'break-word', // Allow long words to break
        wordWrap: 'break-word', // Fallback for older browsers
        padding: '20px',
        textAlign: 'center',
        color: '#ebebeb'
      }}>
        <MinimalRealtimeLevelChart
          tidalLevel={tidalLevel}
          selectedDate={selectedDate}
        />
      </div>
    </Box>
  );
};

export default SliderWidget;