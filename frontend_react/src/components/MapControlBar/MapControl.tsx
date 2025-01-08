import * as React from 'react';
import { Remove, Add, Info, OpenInFull} from '@mui/icons-material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { IconButton } from '@mui/material';

const buttons = [
    { icon: <Add/>, value: 'add' as SelectedMapType },
    { icon: <Remove/>,  value: 'remove' as SelectedMapType },
    { icon: <Info/>,  value: 'info' as SelectedMapType },
    { icon: <OpenInFull/>,  value: 'expand' as SelectedMapType},
];

type SelectedMapType = "add" | "remove" | "info" | "expand";

const ButtonComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const handleButtonClick = (value: SelectedMapType) => {
      setSelectedValue(value);
    //   setSelectedMap(value);
     }

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
            backgroundColor: '#18181B',
            opacity: '90%',
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
       {buttons.map((button) => (
         <IconButton
            key={button.value} 
            onClick={() => handleButtonClick(button.value)} 
            sx={{ 
              color: '#fff', 
              }}
            >
            {button.icon}
         </IconButton>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default ButtonComponent;