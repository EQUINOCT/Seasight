import React, { useEffect, useState } from "react";
import axios from 'axios';
import Draggable from "react-draggable";
import Stack from '@mui/material/Stack';
import { Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import WavesIcon from '@mui/icons-material/Waves';
import DayCardScroller from "./DayCardScroller";

const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

interface Data {
  lsg_name: string;
  urban_area: number;
  water_area: number;
  agricultural_area: number;
}


interface CalendarWidgetProps {
  regionId: string;
  tidalLevel: number;
}


const CalendarWidget: React.FC<CalendarWidgetProps> = ({regionId, tidalLevel}) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialData: Data = {
    lsg_name: 'lsg_name',
    urban_area: 0,
    water_area: 0,
    agricultural_area: 0
  };
  
  const [data, setData] = useState<Data>(initialData);
  

  useEffect(() => {
      fetchLSGData('/api/lsg-data/lsg-name', '/api/impact-data/lsg/area', regionId, tidalLevel);
      
    }, [dataServeUrl, regionId, tidalLevel]);


  const fetchLSGData = async (nameEndPoint: string, areaEndPoint: string, regionId: string, tidalLevel: number) => {
    setLoading(true);

    try {        
        const nameResponse = await axios.get(`${dataServeUrl}${nameEndPoint}`, {
            params: {
                region_id: regionId,
            }
      });    
        const areaResponse = await axios.get(`${dataServeUrl}${areaEndPoint}`, {
            params: {
                region_id: regionId,
                tidal_level: tidalLevel
            }
      });

    const data: Data = {
      lsg_name: nameResponse.data['lsg_name'],
      urban_area: areaResponse.data['urban'],
      water_area: areaResponse.data['water'],
      agricultural_area: areaResponse.data['agriculture']
    }

    setData(data);
    } catch (error) {
    console.error('Error fetching analytics data:', error);
    } finally {
    setLoading(false);
    }
  }


  

  return (
  <Draggable>
   <section className="flex flex-col text-white font-inter rounded-[18px] w-[300px] max-w-[300px] p-0 m-0 min-h-0 h-auto leading-tight overflow-hidden">
      <div className={`flex flex-col pb-4 rounded-[18px] bg-zinc-900 bg-opacity-90`}>
        {/* <header className={`flex flex-col pt-3.5 w-full ${isCollapsed ? "bg-transparent" : "rounded-[22px_22px_1px_1px] bg-zinc-800 bg-opacity-80 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"}`}> */}
            <div className="pl-[15px] pt-5 pb-1.5 text-[16px] leading-none">
             {data.lsg_name}
            </div>
        <Typography sx={{fontSize: '14px', paddingLeft: '15px', paddingBottom: 1.5, color: '#EBF9F5'}}> Tidal Calendar </Typography>      
            <DayCardScroller 
              regionId={regionId}
            />

        <Typography sx={{fonSize: '14px', paddingLeft: '15px', paddingBottom: 1, color: '#EBF9F5'}}> Land Area Affected </Typography>   
          <Grid container spacing={0.5} direction="row" size={{xs: 12}} sx={{ paddingX: '15px'}}>
              <Grid size={{ xs: 12, md: 4}}>
                <Card sx={{
                  bgcolor: 'rgb(0,0,0, 0.3)',
                  color: '#fff',
                  borderRadius: '8px'
                }}>
                  <CardContent sx={{
                    padding: '8px !important'
                  }}>
                    <Typography sx={{fontSize: '10px'}}>Urban</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                          <span style={{ fontSize: '18px', marginRight: '1px' }}>{data.urban_area}</span>
                          <span style={{ fontSize: '9px' }}>sqkm</span>
                    </Typography> 
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4}}>
                <Card sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    borderRadius: '8px',
                  }}>
                    <CardContent  sx={{
                    padding: '8px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                  }}>
                      <Typography sx={{ fontSize: '10px'}}>Agriculture</Typography>
                      <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                          <span style={{ fontSize: '18px', marginRight: '1px' }}>{data.agricultural_area}</span>
                          <span style={{ fontSize: '9px' }}>sq km</span>
                      </Typography> 
                    </CardContent>
                  </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4}}>
                <Card sx={{
                    bgcolor: 'rgb(0, 0, 0, 0.3)',
                    color: '#fff',
                    borderRadius: '8px',
                  }}>
                    <CardContent  sx={{
                    padding: '8px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                  }}>
                      <Typography sx={{fontSize: '10px'}}>Water</Typography>
                      <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                          <span style={{ fontSize: '18px', marginRight: '1px' }}>{data.water_area}</span>
                          <span style={{ fontSize: '9px' }}>sq km</span>
                      </Typography> 
                    </CardContent>
                  </Card>
              </Grid>
          </Grid>        
      </div>
    </section>
  </Draggable>
  );
}

export default CalendarWidget;