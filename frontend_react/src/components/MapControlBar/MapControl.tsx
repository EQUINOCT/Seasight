import * as React from 'react';
import { Map } from 'maplibre-gl';
import { Remove, Add, Info, OpenInFull} from '@mui/icons-material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { IconButton } from '@mui/material';
import Draggable from 'react-draggable';

const buttons = [
    { icon: <Add/>, value: 'add' as SelectedButtonType},
    { icon: <Remove/>,  value: 'remove' as SelectedButtonType},
    { icon: <Info/>,  value: 'info' as SelectedButtonType},
    { icon: <OpenInFull/>,  value: 'expand' as SelectedButtonType},
];

type SelectedButtonType = "add" | "remove" | "info" | "expand";

interface ButtonComponentProps {
  map: Map | undefined;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({map}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const handleButtonClick = (value: SelectedButtonType) => {
      if (!map) return;
      if (value === 'add') {
        map.zoomIn();
      } else if (value === 'remove') {
        map.zoomOut();
      }
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
        <ButtonGroup 
        variant="contained" 
        color="primary" 
        aria-label="Medium-sized button group"
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
                width: '35px',
                height: '35px',
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