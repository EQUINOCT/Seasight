import React, { useRef, useEffect, useState } from 'react';
import {Map, NavigationControl, MapMouseEvent} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import { useConfig } from "../../ConfigContext";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { addLayerLocal, removeLayer, addRegionLayer, removeRegionLayer } from '../../layers/PolygonLayer';

type SelectedMapStyle = "basic" | "satellite";

interface ImpactMapComponentProps {
  map: Map | undefined;
  setMap: (value: Map | undefined) => void;
  selectedMapStyle: SelectedMapStyle;
  selectedLayer: string[];
  tidalLevel: number;
  ifRegion: boolean;
  // regionId: string;
  // setRegionId: (value: string) => void;
}


const ImpactMapComponent: React.FC<ImpactMapComponentProps> = ({map, setMap, selectedLayer, tidalLevel, selectedMapStyle, ifRegion}) => {
  const { config } = useConfig();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lng = config.MAP_CONFIG.LON;
  const lat = config.MAP_CONFIG.LAT;
  const zoom = config.MAP_CONFIG.ZOOM;
  const API_KEY = config.MAPTILER_API_KEY;
  const mapStyleUrl = config.MAP_STYLE[selectedMapStyle.toUpperCase()];
  const [activeLayers, setActiveLayers] = useState<{[key: string]: boolean}>(
    {'Roads': false,
     'Buildings': false,
     'Landcover': false,
     'Inundation': false
    }
  );

  useEffect(() => {   
    if (mapContainer.current) {
      const map = new Map({
        container: mapContainer.current,
        style: config.MAP_STYLE[selectedMapStyle.toUpperCase()],
        center: [lng, lat],
        zoom: zoom
      });   

      // let nav = new NavigationControl();
      // map.addControl(nav, 'bottom-left');

      map.on('load', async () => {
        setMap(map);
      });

      return () => {
        map.remove();
      };
    }
  }, [selectedMapStyle]); 

  useEffect(() => {
    if (!map) return;

    if (ifRegion === true) {
      addRegionLayer(map, 'admin', config)
    } else {  
      removeRegionLayer(map, config, 'admin')
    }
  }, [ifRegion]);

  useEffect(() => {

    if (!map || !tooltipRef.current) return;

    const layerId = config.REGION['admin']['LAYER_ID'];

    const showTooltip = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId], // Replace with your layer name
      });

      console.log(features);

      if (features.length) {
        const feature = features[0];
        if (tooltipRef.current) {
          tooltipRef.current.innerHTML = feature.properties.name; // Assuming 'name' is a property of your feature
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${e.originalEvent.clientX + 10}px`; // Offset for better visibility
          tooltipRef.current.style.top = `${e.originalEvent.clientY + 10}px`;
        }
      }
    };

    const hideTooltip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    };

    // const handleClick = (e: MapMouseEvent) => {
    //   const features = map.queryRenderedFeatures(e.point, {
    //     layers: [layerId], // Replace with your layer name
    //   });

    //   if (features.length) {
    //     const feature = features[0];
    //     // Display additional information or perform actions based on the clicked feature
    //     alert(`You clicked on: ${feature.properties.name}`); // Example action
    //   }
    // };

    // Add event listeners
    map.on('mousemove', layerId, showTooltip);
    map.on('mouseleave', layerId, hideTooltip);
    // map.on('click', layerId, handleClick);

    // Clean up event listeners on unmount
    return ()=> {
      map.off('mousemove', layerId, showTooltip);
      map.off('mouseleave', layerId, hideTooltip);
      // map.off('click', layerId, handleClick);
    };

  }, [map]);


  useEffect(() => {
    if (!map) return; // Exit if the map is not initialize

    const newLayers = { ...activeLayers };

    Object.keys(activeLayers).forEach(layer => {
      if (!selectedLayer.includes(layer)) {
        removeLayer(map, config, layer);
        newLayers[layer] = false;
      } else {
        removeLayer(map, config, layer);
            // Round off tidalLevel to 1 decimal place in order to pick the correct file from public/shapefiles
        addLayerLocal(map, layer, config, tidalLevel.toFixed(1));
      }
    });

    setActiveLayers(newLayers);
    
    // selectedLayer.forEach(layer => {
    //   removeLayer(map, config, layer);
    //   if(!activeLayers[layer] === true) {
    //     // const fileUrl = `/Coastal_Roads_geojson/coastal_roads${tidalLevel.toString().replace(/\./g, '_')}.geojson`;

    //     addLayerLocal(map, layer, config, tidalLevel); 
    //     newLayers[layer] = true;
    //   }
    // })
  }, [selectedLayer, map, tidalLevel]); // Depend on selectedMap, map, and currentFeatureLayerId

    // Update existing layers when tidal level changes
  useEffect(() => {
    if (!map) return;

    Object.keys(activeLayers).forEach(layer => {
      if (activeLayers[layer] === true) {
        removeLayer(map, config, layer);
        addLayerLocal(map, layer, config, tidalLevel);
        setActiveLayers(prev => ({
          ...prev,
          [layer]: true
        }));
      }
    });
  }, [tidalLevel, map]);


  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          background: 'white',
          padding: '5px',
          border: '1px solid black',
          display: 'none',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </div>
  )
};

export default ImpactMapComponent;