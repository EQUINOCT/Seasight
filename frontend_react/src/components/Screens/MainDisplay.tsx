import React from "react";
import AnalyticsScreen from './AnalyticsScreen';
import MapScreen from "./MapScreen";

interface MainDisplayProps {
    activeControl: string;
    activeView: string;
    visibleWidgets: { alerts: boolean; layers: boolean; legend: boolean };
    onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;  
}

const MainDisplay: React.FC<MainDisplayProps> = ({ activeControl, activeView, onWidgetToggle, visibleWidgets }) => {
  // Render based on active control and active view
  if (activeControl === 'map') {
     return <MapScreen/>;
    // Add conditions for other views like analytics, settings, etc.
}
// if (activeControl === 'Forecast') {
//     if (activeView === 'Visualization') return <ForecastScreen />;
// }
if (activeControl === 'analytics') {
    return <AnalyticsScreen />;
}

// Default to the Monitoring map if no matching case
return <MapScreen/>;
};

export default MainDisplay;