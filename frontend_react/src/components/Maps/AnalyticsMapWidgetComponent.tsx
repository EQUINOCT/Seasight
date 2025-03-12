import React, { useRef, useEffect, useState } from 'react';
import {Map, Marker, NavigationControl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import { useConfig } from "../../ConfigContext";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
// import { addLayerLocal, removeLayer } from '../../layers/PolygonLayer';

const AnalyticsMapWidgetComponent: React.FC = () => {
  const { config } = useConfig();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const lng = 76.266667;
  const lat = 9.966667;
  const zoom = config.MAP_CONFIG.ZOOM;
  
  useEffect(() => {
    if (mapContainer.current) {
      const map = new Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/dataviz/style.json?key=rOzi4RnlGlqlLc5ozKz4',
        center: [lng, lat],
        zoom: zoom
      });
      
      // let nav = new NavigationControl();
      // map.addControl(nav, 'bottom-left');
      
      map.on('load', async () => {
        const marker = new Marker()
        .setLngLat([lng, lat])
        .addTo(map);
        // const image = await map.loadImage('/markers/tidal-station.png');
        // map.addImage('tidal-station', image.data);
        // map.addSource('point', {
        //   'type': 'geojson',
        //   'data': {
        //     'type': 'FeatureCollection',
        //     'features': [
        //       {
        //         'type': 'Feature',
        //         'geometry': {
        //           'type': 'Point',
        //           'coordinates': [lng, lat]
        //         },
        //         'properties': {}
        //       }
        //     ]
        //   }
        // });
        // map.addLayer({
        //   'id': 'points',
        //   'type': 'symbol',
        //   'source': 'point',
        //   'layout': {
        //     'icon-image': 'tidal-station',
        //     'icon-size': 0.10
        //   }
        // });
      });
    }
  }, []); // Add dependency array
  
  return (
    <div ref={mapContainer} className='map' />
  );
};

export default AnalyticsMapWidgetComponent;

