import React, {useState, useEffect } from "react";
import LayersComponent from "../LayerWidget/LayersComponent";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import MapControlBar from "../MapControlBar/MapControl";
import EQLogo from './Logo.png';
import SliderWidget from "../SliderWidget/Slider";
import MoonWidget from "../MoonWidget/MoonWidget";
import { useConfig } from '../../ConfigContext';

type SelectedMapType = "flood-inundation" | "population" | "households" | "agriculture";

const MapScreen: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string[]>(['Inundation']);
  const [tidalLevel, setTidalLevel] = useState<number>(1);
  const [mode, setMode] = useState<string>('Real-time mode');
  const [loading, setLoading] = useState(true);

  const { config } = useConfig();
  const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;
  console.log(dataServeUrl);

  useEffect(() => {
    fetch(`${dataServeUrl}/api/current-level`)
      .then(response => response.json())
      .then(data => {
        setTidalLevel(Number(data.level.toFixed(1)));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching current level:', error);
        setLoading(false);
      });
  }, [dataServeUrl]);


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

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      <div className="absolute w-full h-full overflow-hidden">
        <ImpactMapComponent
          selectedLayer = {selectedLayer}
          tidalLevel = {tidalLevel}
        />
      </div>

      {/* Widgets */}
      <div className="absolute top-1/2 right-0 mr-[20px] pb-5 transform -translate-y-1/2 flex flex-col items-center">
          <LayersComponent
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
          />
      </div>
      <div className="absolute right-0 bottom-0 pr-[20px] pb-[5px]">
        <img src={EQLogo} alt="Logo" className="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
      </div>
      <div className="absolute top-1/2 left-0 ml-[20px] transform -translate-y-1/2">
        <SliderWidget
          tidalLevel = {tidalLevel}
          setTidalLevel={setTidalLevel}
          loading={loading}
          // onValueChange={handleSliderChange}
          />
      </div>
      <div className="absolute bottom-0 left-1/2 mb-[10px] transform -translate-x-1/2">
        <MoonWidget/>
      </div>
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
        <MapControlBar/>
      </div>
    </div>
  );
};

export default MapScreen;