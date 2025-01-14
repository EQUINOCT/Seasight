import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';

const ButtonComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  const [moonPhaseData, setMoonPhaseData] = React.useState<{ [key: string]: string }>({});
  const canvasRef = React.useRef<HTMLDivElement | null>(null);

    const highTideDays = [
        new Date('2024-12-15'),
        new Date('2024-12-16'),
        new Date('2024-12-17'),
        new Date('2024-12-18'),
    ];

    const today = new Date();
    const daysToDisplay = [...highTideDays, today];

    const shadowSizeMapping: { [key: string]: number } = {
        'New Moon': 0,
        'Waxing Crescent': 0.25,
        'First Quarter': 0.5,
        'Waxing Gibbous': 0.75,
        'Full Moon': 1.0,
        'Waning Gibbous': 0.75,
        'Last Quarter': 0.5,
        'Waning Crescent': 0.25,
    };

    const fetchMoonPhaseData = async () => {
     const moonPhaseData = await Promise.all(
        daysToDisplay.map(async (date)=>{
            const response = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${Math.floor(date.getTime() / 1000)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const phase = data[0].Phase; 
                return {
                    date: date.toDateString(),
                    phase: phase,
                    // image: getMoonPhaseImage(phase),
                };
            }
            console.log('Logging moon phase data:',data);
            return{
                date: date.toDateString(),
                phase: 'Unknown',
                // image: getMoonPhaseImage('Unknown'),
            };
        })
     );   

     const phaseData: { [key:string]: string } = {};
     moonPhaseData.forEach((item) => {
        phaseData[item.date] = item.phase;
     });
     console.log('Phase Data:', phaseData);
     setMoonPhaseData(phaseData);
    };

    const handleMoonPhaseSelection = (date: string) => {
        setSelectedValue(date);
        if (canvasRef.current) {
            const phase = moonPhaseData[date];
            const shadowSize = shadowSizeMapping[phase] || 0;
            const isWaxing = phase.includes('Waxing');
            if (window.drawPlanetPhase) {
                canvasRef.current.innerHTML = ''; // Clear existing content
                window.drawPlanetPhase(canvasRef.current, shadowSize, isWaxing);
            } else {
                console.error("drawPlanetPhase is not defined on the window object.");
            }
        }
    };

    React.useEffect(() => { 
        fetchMoonPhaseData();
    }, []);

    React.useEffect(() => {
        if (typeof window.drawPlanetPhase !== 'function') {
            console.error('drawPlanetPhase is not loaded!');
        } else {
            console.log('drawPlanetPhase is loaded and ready to use.');
        }
    }, []);
    

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup variant="contained" color="primary" aria-label="Medium-sized button group"
        sx={{
            '& .MuiButton-contained': {
            backgroundColor: '#2F2F2F', // zinc-900
            '&:hover': {
                backgroundColor: '#232324', // zinc-900
            },
            '&:not(:last-child)': {
                borderRight: '1px solid #232324', // Change the border color to white
            },
            },
        }}
        >
       {daysToDisplay.map((date, index) => {
       const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
       });
       const dayOfWeek = date.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      
       return (
         <Button 
            key={index} 
            onClick={() => handleMoonPhaseSelection(date.toDateString())} 
            sx={{ 
              fontSize: 'text-base', 
              fontFamily: 'Inter', 
              textTransform: 'none' ,
              backgroundColor: selectedValue === date.toDateString() ? '#18181B !important' : undefined,
              color: selectedValue === date.toDateString() ? '#fff' : undefined, 
              flexDirection: 'column', // Aligns content vertically
              alignItems: 'center',
              }}
            >
            <div
                style={{
                width: '50px',
                height: '50px',
                margin: '5px',
                }}
                ref={(el) => {
                if (el && moonPhaseData[date.toDateString()]) {
                    const phase = moonPhaseData[date.toDateString()];
                    const shadowSize = shadowSizeMapping[phase] || 0;
                    const isWaxing = phase.includes('Waxing');
                    el.innerHTML = ''; // Clear previous drawings
                    window.drawPlanetPhase(el, shadowSize, isWaxing, {
                    diameter: 50,
                    shadowColour: '#000',
                    lightColour: '#fff',
                    blur: 2,
                    });
                  }
                }}
            />
                <Typography sx={{ fontSize: '14px', lineHeight: '1.2', color: '#fff' }}>
                    {formattedDate}
                </Typography>
                <Typography sx={{ fontSize: '10px', lineHeight: '1.5', color: '#bbb' }}>
                    {dayOfWeek}
                </Typography>
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

export default ButtonComponent;
