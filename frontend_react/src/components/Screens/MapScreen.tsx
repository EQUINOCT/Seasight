import React, { useRef, useState, useEffect } from "react";
import { Map } from 'maplibre-gl';
import axios from 'axios';

import LayersComponent from "../LayerWidget/LayersComponent";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import MapControlBar from "../MapControlBar/MapControl";
import EQLogo from './Logo.png';
import SliderWidget from "../SliderWidget/Slider";
import MoonWidget from "../MoonWidget/MoonWidget";
import CalendarWidget from "../Calendar/CalendarWidget";
import { useConfig } from '../../ConfigContext';
import { data } from "@maptiler/sdk";

type SelectedMapType = "flood-inundation" | "population" | "households" | "agriculture";
type SelectedMapStyle = "basic" | "satellite";

interface MapScreenProps {
  regionId: string;
  setRegionId:(value: string) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({regionId, setRegionId}) => {
  const [map, setMap] = useState<Map>();
  const [selectedMapStyle, setSelectedMapStyle] = useState<SelectedMapStyle>('basic');
  const [ifRegion, setIfRegion] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<string[]>(['Inundation']);
  const [tidalLevel, setTidalLevel] = useState<number>(1);
  const [timeStampAtLevel, setTimeStampAtLevel] = useState<Date>(new Date());
  const [mode, setMode] = useState<string>('Real-time mode');
  const [loading, setLoading] = useState(true);
  
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { config } = useConfig();

  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = React.useState(dateToday);


  const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

  useEffect(() => {
    fetch(`${dataServeUrl}/api/current-level`)
      .then(response => response.json())
      .then(data => {
        setTidalLevel(Number(data.toFixed(1)));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching current level:', error);
        setLoading(false);
      });
  }, [dataServeUrl]);

  useEffect(() => {
    if (selectedDate) {

      let endPoint: string;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      const currentDateStr = currentDate.toDateString();
      const selectedDateStr = selectedDate.toDateString();
      if (selectedDate > currentDate) {
        endPoint = '/api/map/predicted-data/by-date/max';
      } else if (selectedDateStr === currentDateStr) {
        endPoint = '/api/current-level';
      }  else {
        endPoint = '/api/map/realtime-data/by-date/max';
      }
      fetchMaxLevelOnDate(selectedDate, endPoint);
    }
  }, [selectedDate]);

  const fetchMaxLevelOnDate = async (selectedDate: Date, endPoint: string) => {
    setLoading(true);
   
    try {
      const response = await axios.get(`${dataServeUrl}${endPoint}`, {
        params: {
        selected_date: selectedDate.toISOString()
      }
    });
    // Properly type the result
    interface TidalLevelResponse {
      timestamp: string;
      tidal_level: number;
    }

    const result: TidalLevelResponse = await response.data;
    const maxTidalLevelOnDate = result.tidal_level;
    const timeStampAtMaxLevel: Date = new Date(result.timestamp);
    console.log(result);

    if(typeof maxTidalLevelOnDate === 'number' && !isNaN(maxTidalLevelOnDate)) {
      setTidalLevel(Number(maxTidalLevelOnDate.toFixed(1)));
      setTimeStampAtLevel(timeStampAtMaxLevel);
    }
    } catch (error) {
    console.error('Error fetching analytics data:', error);
    } finally {
    setLoading(false);
    }
  };


  // const handleSliderChange = (value: number) => {
  //   if(value!==1.2) {
  //     setMode('Scenario Mode');
  //   }  else {
  //     setMode('Real-time Mode');
  //   }
  // }
 
  const logoStyle = {
    width: '100px', // Set the width to 100px
    height: '100px', // Set the height to 100px
    objectFit: 'contain', // Maintain aspect ratio
   };
  console.log(tidalLevel, timeStampAtLevel);
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      <div className="absolute w-full h-full overflow-hidden">
        <ImpactMapComponent
          map = {map}
          setMap = {setMap}
          selectedMapStyle={selectedMapStyle}
          selectedLayer = {selectedLayer}
          tidalLevel = {tidalLevel}
          ifRegion = {ifRegion}
          regionId = {regionId}
          setRegionId = {setRegionId}
        />
      </div>

      {/* Widgets */}
      <div className="absolute top-1/2 right-0 mr-[20px] pb-5 transform -translate-y-1/2 flex flex-row items-left gap-[10px]">
          {/* <CalendarWidget/> */}
          <LayersComponent
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
            selectedMapStyle={selectedMapStyle}
            setSelectedMapStyle={setSelectedMapStyle}
            ifRegion={ifRegion}
            setIfRegion={setIfRegion}
          />
      </div>
      <div className="absolute right-0 bottom-0 pr-[20px] pb-[5px]">
        <img src={EQLogo} alt="Logo" className="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
      </div>
      <div className="absolute top-1/2 left-0 ml-[20px] transform -translate-y-1/2">
        <SliderWidget
          tidalLevel = {tidalLevel}
          setTidalLevel = {setTidalLevel}
          timeStampAtLevel={timeStampAtLevel}
          selectedDate={selectedDate}
          loading = {loading}
          // onValueChange={handleSliderChange}
          />
      </div>
      <div className="absolute bottom-0 left-1/2 mb-[10px] transform -translate-x-1/2">
        <MoonWidget
          selectedDate = {selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      {/* <div className="absolute top-1/2 right-0 mr-[50px] transform -translate-y-1/2">
        <CalendarWidget/>
      </div> */}
      {/* <div className="absolute top-0 left-1/2 mt-[70px] transform -translate-x-1/2">
        <div style={{
          backgroundColor: '#18181b',
          opacity: '80%',
          color: '#fff',
          padding: '5px 10px',
          font: '16px',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography>{mode}</Typography>
        </div>
      </div>  */}

      {/*Map Controls*/}
      <div className="absolute top-0 right-0 mt-[62px] mr-[5px]">
        <MapControlBar
          map={map}
        />
      </div>
    </div>
  );
};

export default MapScreen;