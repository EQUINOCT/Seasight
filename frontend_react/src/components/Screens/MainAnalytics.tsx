import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, Breadcrumbs, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import theme from '../theme';
import GaugeAnalyticsScreen from './GaugeAnalyticsScreen';
import PanchayatAnalyticsScreen from './PanchayatAnalyticsScreen';


type Station= 'gauge' | 'panchayat' ;

// interface AnalyticsScreenProps {
//   regionId: string;
//   setRegionId: (value: string) => void;
// }

const AnalyticsScreen: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<Station>('gauge');
  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  }

  const renderTypeAnalytics = () => {
    switch (selectedStation) {
      case 'gauge':
        return <GaugeAnalyticsScreen/>;
      case 'panchayat':
       return <PanchayatAnalyticsScreen
      //  regionId = {regionId}
      //  setRegionId = {setRegionId}
       />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="overflow-auto w-full h-full mx-auto relative">  
          {/* <Grid 
            container 
            spacing={1} 
            sx={{ height:'100%', alignItems: 'stretch', bgcolor: '#27272a', overflow: 'auto'}} 
            > */}

              <Grid container direction="row" spacing={0} sx={{ width: '100%', height: '100%', pt: '70px', bgcolor: '#27272a', overflow: 'auto'}}>
                <Grid size={{xs: 12}} sx={{ height: '4%', pl: 1.5}}>  
                  <Grid className='flex flex-row font-inter gap-1'>
                    <Link 
                    underline="hover" 
                    sx={{ maxWidth: 80, height: '25px'}} 
                    href="#gauge"
                    onClick={() => handleStationClick('gauge')}
                    color={selectedStation === 'gauge' ? '#fff' : '#488DA3'}
                    bgcolor={selectedStation === 'gauge' ? '#488DA3' : '#fff'}
                    >
                        Gauge
                    </Link>
                    <Link 
                    underline="hover" 
                    sx={{ maxWidth: 100, height: '25px'}} 
                    href="#panchayat"
                    onClick={() => handleStationClick('panchayat')}
                    color={selectedStation === 'panchayat' ? '#fff' : '#488DA3'}
                    bgcolor={selectedStation === 'panchayat' ? '#488DA3' : '#fff'}
                    >
                        Panchayat
                    </Link>
                  </Grid>
                </Grid>

                <Grid size={{xs:12}} sx={{height:'95%'}}>
                      {renderTypeAnalytics()}
                </Grid>
              </Grid>  
          {/* </Grid> */}
        </div>
    </ThemeProvider>
  );
};

export default AnalyticsScreen;