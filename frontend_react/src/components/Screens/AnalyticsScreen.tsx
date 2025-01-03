import React, { useState } from "react";
import HighlightComponent from "../BasinHighlights/HighlightComponent";
import ButtonComponent from "../LevelNav/ImpactButtons";
import ImpactMapComponent from "../Maps/ImpactMapComponent";
import { addBoundaryLayer, removeBoundaryLayer } from "../../layers/PolygonLayer";
import Slider from "../SliderWidget/Slider";

const ImpactScreen: React.FC = () => {
  
  return (
    <div className="monitor-screen w-full h-full relative bg-white flex flex-col rounded-[15px] overflow-hidden">
      {/* <div className="absolute w-full h-full rounded-[15px] overflow-hidden">
        <ImpactMapComponent
          selectedMap = {selectedMap}
        />
      </div> */}
      {/* <div className="absolute w-full h-full rounded-[15px] overflow-hidden">
        {selectedMap === 'flood-inundation' && <img src={floodInundation} alt="Flood Inundation" className="w-full h-full object-cover"/>}
        {selectedMap === 'population' && <img src={population} alt=" " className="w-full h-full object-cover"/>}
        {selectedMap === 'households' && <img src={households} alt=" " className="w-full h-full object-cover"/>}
        {selectedMap === 'agriculture' && <img src={agriculture} alt=" " className="w-full h-full object-cover"/>}
      </div> */}

      {/* <div style={{ position: "absolute", top: "0px", left: "0px"}}>
        <ButtonComponent setSelectedMap={setSelectedMap}/>
      </div> */}

      {/* <div className="absolute font-inter top-0 right-0 mt-[10px] mr-[20px] flex flex-col items-end">
        <HighlightComponent/>
      </div> */}

      {/* <div style={{position: "absolute", bottom: "10px", left: "10px"}}>
        <Slider/>
      </div> */}
    </div>
  );
};

export default ImpactScreen;
