import * as React from 'react';
import Slider from '@mui/material/Slider';
import { Box, Typography } from '@mui/material';

const marks = [
  {
    value: 0,
    label: '0m',
  },
  {
    value: 1.2,
    label: '1.2m',
  },
  {
    value: 2,
    label: '2m',
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

const SliderWidget: React.FC = () => {
    return (
    
    <Box
    sx={{ 
      display: 'flex',
      flexDirection: 'row',
      width: '250px',
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
          <div style={{display: 'flex'}}>
              <Typography sx={{fontSize: 12, color: '#fff', ml: -1, lineHeight: '1.1'}}>Sea Level Meter</Typography>
              {/* <Typography sx={{fontSize: '10px', color: '#fff',opacity: '70%', ml: 0.5, mt: 1.75}}>{'(Above Mean Sea Level)'}</Typography> */}
          </div>
          <Slider
              aria-label="Restricted values"
              defaultValue={1.2}
              getAriaValueText={valuetext}
              orientation="vertical"
              valueLabelDisplay="auto"
              marks
              shiftStep={30}
              step={0.1}
              min={1}
              max={2}
              sx={{
                  color: '#61B3FF', // Change the slider color if needed
                  height: '90%',
                  mt: 1,
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#fff', // Color of the thumb
                  },
                  '& .MuiSlider-track': {
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
          alignItems: 'center'
          }}>
          <Typography sx={{fontSize: 12, color: '#fff', mt: 2}}>Information</Typography>
      </div>
    </Box>
  );
 };

 export default SliderWidget;

 