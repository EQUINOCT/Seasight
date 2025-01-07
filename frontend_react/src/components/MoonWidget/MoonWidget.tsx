import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';

const ButtonComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  const [moonPhaseImages, setMoonPhaseImages] = React.useState<{ [key: string]: string }>({});

    const highTideDays = [
        new Date('2024-12-15'),
        new Date('2024-12-16'),
        new Date('2024-12-17'),
        new Date('2024-12-18'),
    ];

    const today = new Date();
    const daysToDisplay = [...highTideDays, today];

    const fetchMoonPhaseImages = async () => {
     const moonPhaseData = await Promise.all(
        daysToDisplay.map(async (date)=>{
            const response = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${Math.floor(date.getTime() / 1000)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const phase = data[0].Phase; 
                return {
                    date: date.toDateString(),
                    phase: phase,
                    image: getMoonPhaseImage(phase),
                };
            }
            console.log('Logging moon phase data:',data);
            return{
                date: date.toDateString(),
                phase: 'Unknown',
                image: getMoonPhaseImage('Unknown'),
            };
        })
     );

     const images: { [key:string]: string } = {};
     moonPhaseData.forEach((item) => {
        images[item.date] = item.image;
     });
    //  console.log(images);
     setMoonPhaseImages(images);
    };

    const getMoonPhaseImage = (phase: string) => {
        switch (phase) {
            case 'New Moon':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/New_Moon.png/1200px-New_Moon.png'; 
            case 'Waxing Crescent':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Waxing_Crescent_Moon.png/1200px-Waxing_Crescent_Moon.png';
            case 'First Quarter':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/First_Quarter_Moon.png/1200px-First_Quarter_Moon.png';
            case 'Waxing Gibbous':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Waxing_Gibbous_Moon.png/1200px-Waxing_Gibbous_Moon.png';
            case 'Full Moon':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Full_Moon.png/1200px-Full_Moon.png';
            case 'Waning Gibbous':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Waning_Gibbous_Moon.png/1200px-Waning_Gibbous_Moon.png';
            case 'Last Quarter':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Last_Quarter_Moon.png/1200px-Last_Quarter_Moon.png';
            case 'Waning Crescent':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Waning_Crescent_Moon.png/1200px-Waning_Crescent_Moon.png';
            default: 
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/New_Moon.png/1200px-New_Moon.png';
        }
    }

    React.useEffect(() => { 
        fetchMoonPhaseImages();
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
       {daysToDisplay.map((date, index) => (
         <Button 
            key={index} 
            onClick={() => setSelectedValue(date.toDateString())} 
            sx={{ 
              fontSize: 'text-base', 
              fontFamily: 'Inter', 
              textTransform: 'none' ,
              backgroundColor: selectedValue === date.toDateString() ? '#18181B !important' : undefined,
              color: selectedValue === date.toDateString() ? '#fff' : undefined, 
              }}
            >
            {date.toDateString()}
         </Button>
        ))}
      </ButtonGroup>
      
      {selectedValue && moonPhaseImages[selectedValue] && (
        <Box sx={{ mt: 2, textAlign: 'center', bgcolor: '#333', text: '16px' }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
                Moon Phase for {selectedValue}:
            </Typography>
            <img
                src={moonPhaseImages[selectedValue]}
                alt={`Moon Phase for ${selectedValue}`}
                style={{ width: '100px', height: '100px', marginTop: '10px'  }} 
            />
            </Box>
      )}
    </Box>
  );
};

export default ButtonComponent;