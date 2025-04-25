import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, Breadcrumbs, Link, InputLabel, FormControl, Select, MenuItem, Box, NativeSelect } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import theme from '../theme';
import GaugeAnalyticsScreen from './GaugeAnalyticsScreen';
import PanchayatAnalyticsScreen from './PanchayatAnalyticsScreen';


type Station= 'gauge' | 'panchayat' ;



interface AnalyticsScreenProps {
  regionId: string;
  setRegionId: (value: string) => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({regionId, setRegionId}) => {
  const [selectedStation, setSelectedStation] = useState<Station>('gauge');
  const [panchayat, setPanchayat] = useState(false);
  const [selectedPanchayatValue, setSelectedPanchayat] = useState('Ezhikkara');

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    if(station === 'panchayat')
    {
      setPanchayat(true);
    } else 
    setPanchayat(false);
  }

  const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetchData("/api/lsg-data/all-stations");
    });

    const fetchData = async (endPoint: string) => {
        setLoading(true);
        try {        
          const response = await axios.get(`${dataServeUrl}${endPoint}`)
          const stationData = await response.data;
          setData(stationData)

        } catch (error) {
        console.error('Error fetching station data:', error);
        } finally {
        setLoading(false);
        }
    };

  const renderStationDropdown = () => {
    switch (selectedStation) {
      case 'gauge':
        return <GaugeAnalyticsScreen/>;
      case 'panchayat':
       return <PanchayatAnalyticsScreen
        regionId = {regionId}
       />;
      default:
        return null;
    }
  };

  // const handlePanchayat = (panchayat: boolean) => {
  //   setPanchayat(true);
  // }

  const renderTypeAnalytics = () => {
    switch (selectedStation) {
      case 'gauge':
        return <GaugeAnalyticsScreen/>;
      case 'panchayat':
       return <PanchayatAnalyticsScreen regionId={regionId}/>;
      default:
        return null;
    }
  };

  const handleStationChange = () => {
    console.log('station changed');
  }

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
                    underline="none" 
                    sx={{ 
                      maxWidth: 80, 
                      height: '25px',
                      '&:hover': {
                        bgcolor: selectedStation === 'gauge' ? '#3a7e91' : '#f0f9fb',
                        textDecoration: 'none',
                      },
                    }} 
                    href="#gauge"
                    onClick={() => handleStationClick('gauge')}
                    color={selectedStation === 'gauge' ? '#fff' : '#488DA3'}
                    bgcolor={selectedStation === 'gauge' ? '#488DA3' : '#fff'}
                    >
                        Gauge
                    </Link>
                    <Link 
                    underline="none" 
                    sx={{ 
                      maxWidth: 100, 
                      height: '25px',
                      '&:hover': {
                        bgcolor: selectedStation === 'panchayat' ? '#3a7e91' : '#f0f9fb',
                        textDecoration: 'none',
                      },
                    }} 
                    href="#panchayat"
                    onClick={() => handleStationClick('panchayat')}
                    color={selectedStation === 'panchayat' ? '#fff' : '#488DA3'}
                    bgcolor={selectedStation === 'panchayat' ? '#488DA3' : '#fff'}
                    >
                        Panchayat
                    
                    </Link>
                    {panchayat && (
                     <Box sx={{
                      minWidth: 120,
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #488DA3',
                      borderRadius: '6px',
                      px: 1,
                      // bgcolor: '#fff',
                      '&:hover': {
                        bgcolor: '#488DA3',
                      },
                    }}>
                     <FormControl fullWidth variant="standard">
                       {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                         Age
                       </InputLabel> */}
                       <NativeSelect
                         disableUnderline
                         defaultValue={'Ezhikkara'}
                         onChange={(e) => setSelectedPanchayat(e.target.value)}
                         inputProps={{
                           name: 'panchayat',
                           id: 'uncontrolled-native',
                         }}
                         sx={{
                          fontSize: 14,
                          color: '#f0f9fb',
                          '&:focus': {
                            backgroundColor: 'transparent',
                          },
                          '& .MuiNativeSelect-select': {
                            color: '#f0f9fb',
                            paddingRight: '12px'
                          },
                          '& svg': {
                            color: '#f0f9fb', // icon color
                            padding: 0,
                          },
                        }}
                       >
                         <option value="Select Panchayat">Select Panchayat</option>
                         <option value="Ezhikkara">Ezhikkara</option>
                         <option value="Panchayat 2">Panchayat 2</option>
                         <option value="Panchayat 3">Panchayat 3</option>
                       </NativeSelect>
                     </FormControl>
                   </Box>
                    )}
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