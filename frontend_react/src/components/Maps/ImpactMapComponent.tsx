import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import { useConfig } from "../../ConfigContext";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { addLayerLocal, removeLayer } from '../../layers/PolygonLayer';

interface ImpactMapComponentProps {
  selectedLayer: string[];
  tidalLevel: number;
}


const ImpactMapComponent: React.FC<ImpactMapComponentProps> = ({selectedLayer, tidalLevel}) => {
  const { config } = useConfig();
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const lng = config.MAP_CONFIG.LON;
  const lat = config.MAP_CONFIG.LAT;
  const zoom = config.MAP_CONFIG.ZOOM;
  const API_KEY = config.MAPTILER_API_KEY;
  const mapStyleUrl = config.MAPS.IMPACT;
  const [activeLayers, setActiveLayers] = useState<{[key: string]: boolean}>(
    {'Roads': false,
     'Buildings': false,
     'Landcover': false,
     'Inundation': false
    }
  );

  useEffect(() => {   
    if (mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [lng, lat],
        zoom: zoom
      });   

      map.on('load', async () => {
        setMap(map);
        
      });

      return () => {
        map.remove();
      };
    }
  }, []); 

  useEffect(() => {
    if (!map) return; // Exit if the map is not initialize

    const newLayers = { ...activeLayers };
    console.log(selectedLayer, tidalLevel);

    Object.keys(activeLayers).forEach(layer => {
      if (!selectedLayer.includes(layer)) {
        removeLayer(map, config, layer);
        newLayers[layer] = false;
      } else {
        removeLayer(map, config, layer);
        addLayerLocal(map, layer, config, tidalLevel);
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
    </div>
  )
};

export default ImpactMapComponent;