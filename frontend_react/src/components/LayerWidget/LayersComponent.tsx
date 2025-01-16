import React, { useState } from "react";
import Draggable from "react-draggable";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import LocationCity from '@mui/icons-material/LocationCity';
import { MdAgriculture } from "react-icons/md";
import { FaRoad } from "react-icons/fa";
import { Typography } from "@mui/material";
import { Water } from "@mui/icons-material";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const boundaries = [
  'Admin',
  'Block',
  'Satellite',
];

interface LayersComponentProps {
  selectedLayer: string[];
  setSelectedLayer: React.Dispatch<React.SetStateAction<string[]>>;
}

const LayersComponent: React.FC<LayersComponentProps> = ({selectedLayer, setSelectedLayer}) => {
  const [boundary, setBoundary] = React.useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (label: string) => {
    setSelectedLayer((prev: string[]) =>
      prev.includes(label)
        ? prev.filter((item: string) => item !== label) // Remove if already selected
        : [...prev, label] // Add if not selected
    );
  };

  const handleChange = (event: SelectChangeEvent<typeof boundary>) => {
    const {
      target: { value },
    } = event;
    setBoundary(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const icons = [
    { label: 'Inundation', icon: <Water /> },
    { label: 'Buildings', icon: <LocationCity /> },
    { label: 'Landcover', icon: <MdAgriculture /> },
    { label: 'Roads', icon: <FaRoad /> },
  ];
  
  return (
    <Draggable>
    <section className={`flex flex-col text-white font-inter rounded-3xl w-[90px] max-w-[90px] h-auto max-h-[400px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>
      <div className={`flex flex-col pb-4 rounded-[18px] bg-[#488DA3]`}>
        {/* <header className={`flex flex-col pt-3.5 w-full ${isCollapsed ? "bg-transparent" : "rounded-[22px_22px_1px_1px] bg-zinc-800 bg-opacity-80 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"}`}> */}
            <div className="pl-5 pt-5 pb-3 text-base leading-none">
              Layers
            </div>
        {/* </header> */}
        <Stack direction="column" spacing={1.5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              {/* <Button
              sx={{
                textTransform: 'none',
                color: '#fff',
                p:0,
                border: '0.5px solid rgba(250, 250, 250, 0.8)'
              }}
              >
                Admin
              </Button>
              <Button 
              sx={{
                textTransform: 'none',
                color: '#fff',
                p: 0,
                border: '0.5px solid rgba(250, 250, 250, 0.8)'
              }}>
                Block
              </Button>
              <Button 
              sx={{
                textTransform: 'none',
                color: '#fff',
                p: 0,
                border: '0.5px solid rgba(250, 250, 250, 0.8)'
              }}>
                Satellite
              </Button> */}
            <FormControl sx={{ width: '75px', height: '30px', text: '16px' }}>
              <Select
                multiple
                displayEmpty
                value={boundary}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em style={{ color: '#fff', fontStyle: 'normal'}}>View</em>;
                  }

                  return selected.join(', ');
                }}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  fontSize: '14px', // Reduce font size
                  height: '30px',
                  alignItems: 'center',
                  '& .MuiSelect-select': {
                    padding: '0px', // Remove padding from the label area
                    paddingLeft: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  },
                  '& .MuiSelect-icon': {
                    display: 'none', // Disable the down arrow icon
                  },
                }}
              >
                {boundaries.map((boundary) => (
                  <MenuItem
                    key={boundary}
                    value={boundary}
                  >
                    {boundary}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
              {icons.map(({ label, icon }) => (
                <React.Fragment key={label}>
                  <IconButton
                    aria-label={label.toLowerCase()}
                    size="large"
                    onClick={() => handleSelect(label)}
                    sx={{
                      backgroundColor: selectedLayer.includes(label) ? 'white' : '#97C7D6',
                      color: '#2B4A54',
                      '&:hover': {
                        backgroundColor: selectedLayer.includes(label) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(208, 236, 245, 1)',
                      },
                      borderRadius: '50%',
                      padding: '8px',
                    }}
                  >
                    {React.cloneElement(icon, { fontSize: 'inherit' })}
                  </IconButton>
                  <Typography sx={{ fontFamily: 'sarabun',fontSize: '12px', color: '#fff'}}>{label}</Typography>
                </React.Fragment>
              ))}
            </Stack>           
      </div>
    </section>
  </Draggable>
  );
};

export default LayersComponent;