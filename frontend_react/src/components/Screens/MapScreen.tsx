import React, {useState} from "react";
import LayerComponent from "../LayerWidget/LayersComponent";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import MapControlBar from "../MapControlBar/MapControl";
import EQLogo from './Logo.png';
import Slider from "../SliderWidget/Slider";
import MoonWidget from "../MoonWidget/MoonWidget";
import { Typography } from "@mui/material";

type SelectedMapType = "flood-inundation" | "population" | "households" | "agriculture";

const MapScreen: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<SelectedMapType>('flood-inundation');
  const [mode, setMode] = useState<string>('Real-time mode');

   const handleSliderChange = (value: number) => {
    if(value!==1.2) {
      setMode('Scenario Mode');
    }  else {
      setMode('Real-time Mode');
    }
   }

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      <div className="absolute w-full h-full rounded-[15px] overflow-hidden">
        <ImpactMapComponent
          selectedMap = {selectedMap}
        />
      </div>

      {/* Widgets */}
      <div className="absolute top-1/2 right-0 mr-[20px] pb-5 transform -translate-y-1/2 flex flex-col items-center">
          <LayerComponent/>
      </div>
      <div className="absolute right-0 bottom-0 pr-[20px] pb-[5px]">
        <img src={EQLogo} alt="Logo" className="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
      </div>
      <div className="absolute top-1/2 left-0 ml-[20px] transform -translate-y-1/2">
        <Slider onValueChange={handleSliderChange}/>
      </div>
      <div className="absolute bottom-0 left-1/2 mb-[10px] transform -translate-x-1/2">
        <MoonWidget/>
      </div>
      <div className="absolute top-0 left-1/2 mt-[70px] transform -translate-x-1/2">
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
      </div>

      {/*Map Controls*/}
      <div className="absolute top-0 right-0 mt-[62px] mr-[5px]">
        <MapControlBar/>
      </div>
    </div>
  );
};

export default MapScreen;