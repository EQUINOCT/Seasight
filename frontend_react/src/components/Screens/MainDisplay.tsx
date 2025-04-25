import React, {useState} from "react";
import AnalyticsScreen from './MainAnalytics';
import MapScreen from "./MapScreen";

interface MainDisplayProps {
    activeControl: string;
    // activeView: string;
    // visibleWidgets: { alerts: boolean; layers: boolean; legend: boolean };
    // onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;  
}

const MainDisplay: React.FC<MainDisplayProps> = ({ activeControl }) => {
  const [regionId, setRegionId] = useState<string>('LSG000001'); 
  // Render based on active control and active view
  if (activeControl === 'map') {
     return <MapScreen
     regionId = {regionId}
     setRegionId = {setRegionId}
     />;
    // Add conditions for other views like analytics, settings, etc.
}
// if (activeControl === 'Forecast') {
//     if (activeView === 'Visualization') return <ForecastScreen />;
// }
if (activeControl === 'analytics') {
    return <AnalyticsScreen
        regionId = {regionId}
        setRegionId = {setRegionId}
    />;
}

// Default to the Monitoring map if no matching case
return <MapScreen
    regionId = {regionId}
    setRegionId = {setRegionId}
/>;
};

export default MainDisplay;