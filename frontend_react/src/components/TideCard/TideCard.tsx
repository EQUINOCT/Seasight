import * as React from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
// import HighTide from '/high-tide.png';

const TideCard: React.FC = () => {
    const todayDate: Date = new Date();
    const formattedDate: string = todayDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    return (
        <Card
          sx={{
            width: '95%',
            height: '100%',
            marginTop: '5px',
            padding: 1, 
            alignContent: 'start',
            bgcolor: 'rgb(72, 141, 163, 0.8)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: '10px'
          }}
        >
        {/* Content Layout */}
        <Grid size={{xs: 12}} sx={{ width: '100%', height: '100%'}}>
            <Grid size={{xs: 12}} sx={{height: '25%'}}>
                <Typography sx={{ marginBottom: '3px', display: 'flex', justifyContent: 'space-between', textAlign: 'start'}}>
                    <span style={{fontSize: '11px'}}>Tide Schedule</span>
                    <span style={{fontSize: '12px'}}>{formattedDate}</span>
                </Typography>
            </Grid>
            <Grid size={{xs: 12}} container direction="row" spacing={1.2} sx={{ height: '70%'}}>

              {/* High tide */}
              <Grid size={{xs: 12, md: 6}} >
                <Grid size={{xs: 12}} container direction="row" spacing={0.4}  sx={{ height: '100%'}}>
                    <Grid size={{xs: 12, md: 6}}>
                        <Card 
                        sx={{
                        width: '99%',
                        height:'80%',
                        bgcolor: '#fff',
                        alignContent: 'end'
                        }}
                        >
                          <img src="/high-tide.png" alt="Description" width='32px' height='32px'/>
                        </Card>
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <Typography sx={{ fontSize: '9px', whiteSpace: 'nowrap', marginBottom: -0.2}}>High Tide</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                            <span style={{ fontSize: '10px', marginRight: '1px' }}>11.00</span>
                            <span style={{ fontSize: '8px' }}>AM</span>
                        </Typography>
                    </Grid>
                </Grid>
              </Grid>

              {/* Low tide */}
              <Grid size={{xs: 12, md: 6}} >
                <Grid size={{xs: 12}} container direction="row" spacing={0.4} sx={{ height: '100%'}}>
                        <Grid size={{xs: 12, md: 6}}>
                            <Card 
                            sx={{
                            width: '95%',
                            height:'80%',
                            bgcolor: '#fff',
                            alignContent: 'end'
                            }}
                            >
                                 <img src="/low-tide.png" alt="Description" width='32px' height='32px'/>
                            </Card>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <Typography sx={{fontSize: '9px', whiteSpace: 'nowrap', marginBottom: -0.2}}>Low Tide</Typography>
                            <Typography sx={{ display: 'flex', alignItems: 'baseline'}}>
                                <span style={{ fontSize: '10px', marginRight: '1px' }}>03.00</span>
                                <span style={{ fontSize: '8px' }}>PM</span>
                            </Typography>
                        </Grid>
                    </Grid>
              </Grid>
            </Grid>
        </Grid>       
    </Card>
    );
};

export default TideCard;