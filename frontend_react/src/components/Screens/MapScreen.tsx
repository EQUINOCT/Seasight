import React, {useState} from "react";
import AlertWidgetComponent from "../AlertWidget/AlertWidgetComponent";
import LayersComponent from "../LayerWidget/LayersComponent";
import Legend from "../LegendWidget/Legend";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import EQLogo from './Logo.png';
import SliderWidget from "../SliderWidget/Slider";

type SelectedMapType = "flood-inundation" | "population" | "households" | "agriculture";

const MonitorScreen: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string[]>([]);
  const [tidalLevel, setTidalLevel] = useState<number>(1.6);

  const logoStyle = {
    width: '100px', // Set the width to 100px
    height: '100px', // Set the height to 100px
    objectFit: 'contain', // Maintain aspect ratio
   };

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      <div className="absolute w-full h-full rounded-[15px] overflow-hidden">
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
        />
      </div>
      {/* Alerts */}
      {/* <div style={{ position: "absolute", top: "30px", left: "20px" }}>
        {visibleWidgets.alerts && (
          <AlertWidgetComponent
            visibleAlerts={visibleWidgets.alerts}
            OnClose={() => onWidgetToggle('alerts', false)}
          />
        )}
      </div> */}
    </div>
  );
};

export default MonitorScreen;