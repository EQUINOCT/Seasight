import React, { useState } from "react";
import Draggable from "react-draggable";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import LocationCity from '@mui/icons-material/LocationCity';
import { MdAgriculture } from "react-icons/md";
import { FaRoad } from "react-icons/fa";
import { Typography } from "@mui/material";
import { Water } from "@mui/icons-material";


const LayersComponent: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSelect = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label) // Remove if already selected
        : [...prev, label] // Add if not selected
    );
  };

  const icons = [
    { label: 'Inundation', icon: <Water /> },
    { label: 'Buildings', icon: <LocationCity /> },
    { label: 'Agriculture', icon: <MdAgriculture /> },
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
        <Stack direction="column" spacing={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              {icons.map(({ label, icon }) => (
                <React.Fragment key={label}>
                  <IconButton
                    aria-label={label.toLowerCase()}
                    size="large"
                    onClick={() => handleSelect(label)}
                    sx={{
                      backgroundColor: selected.includes(label) ? 'white' : '#97C7D6',
                      color: '#2B4A54',
                      '&:hover': {
                        backgroundColor: selected.includes(label) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(208, 236, 245, 1)',
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