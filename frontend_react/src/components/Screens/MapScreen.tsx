import React, {useState} from "react";
import LayerComponent from "../LayerWidget/LayersComponent";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import EQLogo from './Logo.png';
import Slider from "../SliderWidget/Slider";
import ButtonComponent from "../MoonWidget/MoonWidget";

type SelectedMapType = "flood-inundation" | "population" | "households" | "agriculture";

const MonitorScreen: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<SelectedMapType>('flood-inundation');
 
  const logoStyle = {
    width: '100px', // Set the width to 100px
    height: '100px', // Set the height to 100px
    objectFit: 'contain', // Maintain aspect ratio
   };

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
        <Slider/>
      </div>
      <div className="absolute bottom-0 left-1/2 mb-[20px] transform -translate-x-1/2">
        <ButtonComponent/>
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