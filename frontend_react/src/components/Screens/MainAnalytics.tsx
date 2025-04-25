import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, Breadcrumbs, Link, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
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
  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
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
       return <PanchayatAnalyticsScreen/>;
      default:
        return null;
    }
  };

  const renderTypeAnalytics = () => {
    switch (selectedStation) {
      case 'gauge':
        return <GaugeAnalyticsScreen/>;
      case 'panchayat':
       return <PanchayatAnalyticsScreen/>;
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
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={12}
                        label="Age"
                        onChange={handleStationChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
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