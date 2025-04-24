import React, { useState } from "react";
import WidgetSelector from "./WidgetSelector";
import { Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import Tour from "./TutorialTour";

interface NavigationBarProps {
  activeControl: string;
  setActiveControl: (view:string) => void;
  setActiveView: (view:string) => void;
  menuItems: string[];
  activeView: string;
  onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;
  visibleWidgets: { alerts: boolean; layers: boolean; legend: boolean };
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  activeControl,
  setActiveControl,
  setActiveView,
  menuItems,
  activeView,
  onWidgetToggle,
  visibleWidgets,
 }) => {

  //const [activeControl, setActiveControl] = useState('monitor');

  return (
    <header className="flex items-center justify-between bg-zinc-900 bg-opacity-90 py-1.5 w-full ">
      <div className="flex gap-2 pl-[15px] items-center justify-start">
        <div className="text-[#97C7D6] text-[32px] font-inter"> 
          Seasight
        </div>
        <Typography sx={{ fontFamily: 'sarabun', color: '#fff', pt: '5px', opacity: '90%', textWrap: 'nowrap'}}> Tidal Dashboard </Typography>
      </div>
      
      <nav className="flex justify-center">
        <ul className="flex gap-7 items-center list-none mb-2 ml-7">
          {menuItems.map((item, index) => (  
            <li key={index} className="relative">
              <Link
               to={`/${item.toLowerCase()}`}
               className={` text-white no-underline font-inter bg-transparent w-full block text-center relative z-10 ${ activeControl.toLowerCase() === item.toLowerCase() ? "font-semibold text-[17px]" : "text-base"}`}
               onClick={()=> {
                setActiveControl(item);
                // setActiveView('visualization');
              }}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex pr-[15px] gap-1.5 items-center justify-end">
      <div className="widget-selector-container" style={{ width: 100 }}>
          {activeControl.toLowerCase() === "map" && (
              <WidgetSelector 
                onWidgetToggle={onWidgetToggle}
                visibleWidgets={visibleWidgets}
              />
          )}
        </div>
        <div className="widget-selector-container" style={{ width: 110 }}>
              <Tour />
        </div>
        {/* <LocationSelector /> */}
        <IconButton
          aria-label={'user'}
          // size="large"
          sx={{
            width: '35px',
            height: '35px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '0.5px solid rgba(97, 179, 255, 0.5)',
            color: '#61B3FF',
            borderRadius: '50%',
            padding: '10px',
          }}
        >
         <Notifications sx={{color: '#fff', height: '25px'}}/>
        </IconButton>
        <IconButton
          aria-label={'user'}
          // size="large"
          sx={{
            width: '35px',
            height: '35px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '0.5px solid rgba(97, 179, 255, 0.5)',
            color: '#61B3FF',
            borderRadius: '50%',
            padding: '10px',
          }}
        >
         <Person sx={{color: '#fff'}}/>
        </IconButton>
      </div>
    </header>
  );
};

export default NavigationBar;
