import React, { useState } from "react";
import Draggable from "react-draggable";
import Stack from '@mui/material/Stack';
import { Button, Card, Typography } from "@mui/material";

const LayersComponent = () => {
  const [lsg, setLSG] = useState(false);
  const [satellite, setSatellite] = useState(false);
  
  return (
    <Draggable>
    <section className={`flex flex-col text-white font-inter rounded-[18px] w-[300px] max-w-[300px] h-auto max-h-[400px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>
      <div className={`flex flex-col pb-4 rounded-[18px] bg-zinc-900 bg-opacity-90`}>
        {/* <header className={`flex flex-col pt-3.5 w-full ${isCollapsed ? "bg-transparent" : "rounded-[22px_22px_1px_1px] bg-zinc-800 bg-opacity-80 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"}`}> */}
            <div className="pl-[15px] pt-5 pb-1.5 text-[18px] leading-none">
             Ezhikkara Panchayat
            </div>
        <Typography sx={{font: '16px', paddingLeft: '15px', paddingBottom: 1.5, color: '#97C7D6'}}> Tidal Calendar </Typography>
        {/* </header> */}
        <Stack direction="row" spacing={1.5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              <Card
              sx={{
                textTransform: 'none',
                color: '#97C7D6',
                backgroundColor: "#656565",
                width: '42px',
                height: '60px',
                // border: '0.1px solid rgba(208, 236, 245, 0.8)'
              }}
              >
              </Card>
            </Stack>           
      </div>
    </section>
  </Draggable>
  );
};

export default LayersComponent;