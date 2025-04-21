import { useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useConfig } from '../ConfigContext';
import * as turf from '@turf/turf';
import { Sort, Visibility } from '@mui/icons-material';
import { centerLatLngFromFeature, generateCustomMarker, incrementState } from './misc';
// import { Storage } from '@google-cloud/storage';

async function addRegionLayer(map, layer, configData) {
    const config = configData.REGION[layer];
    const layerUrl = process.env.REACT_APP_LAYER_URL;

    const loadGeoJSON = async () => {
        const fileUrl = `${layerUrl}${config.URL}`;
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const geoJSONContent = await response.json();

            map.addSource(`${config.SOURCE_ID}`, {
                'type': 'geojson',
                'data': geoJSONContent
            })
            map.addLayer({
                'id': config.LAYER_ID,
                'type': config.LAYER_TYPE,
                'source': config.SOURCE_ID,
            });

            map.addLayer({
                'id': config.OUTLINE_LAYER_ID,
                'type': config.OUTLINE_LAYER_TYPE,
                'source': config.SOURCE_ID,
            });
            map.setPaintProperty(config.LAYER_ID, config.COLOR_PARAM, config.COLOR);
            map.setPaintProperty(config.LAYER_ID, config.OPACITY_PARAM, config.OPACITY);
            map.setPaintProperty(config.OUTLINE_LAYER_ID, config.OUTLINE_COLOR_PARAM, config.OUTLINE_COLOR);
            // map.setPaintProperty(config.LAYER_ID, config.OPACITY_PARAM, config.OPACITY);

        } catch (error) {
            console.error('Error fetching or parsing GeoJSON', error);
        }
    }

    loadGeoJSON();
}

async function removeRegionLayer(map, configData, layer) {
    const config = configData.REGION[layer];
    const layerId = config.LAYER_ID;
    const outlineLayerId = config.OUTLINE_LAYER_ID;
    const sourceId = config.SOURCE_ID;
    // Also remove the associated layers before removing the source
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        map.removeLayer(outlineLayerId);
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }

}

async function addLayerLocal(map, layer, configData, tidalLevel) {
    const config = configData.IMPACT[layer];
    const layerUrl = process.env.REACT_APP_LAYER_URL;
    // console.log(config);

    // const storage = new Storage();

    // const getSignedUrl = async (bucketName, fileName) => {
    //     const options = {
    //     version: 'v4',
    //     action: 'read',
    //     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    //     };

    //     const [url] = storage
    //     .bucket(bucketName)
    //     .file(fileName)
    //     .getSignedUrl(options);

    //     return url;
    // };

    const loadGeoJSON = async () => {
        // Custom logic to handle discrepancy in tidal levels in DEMs and observed values by mapping the level
        // to the layer shapefiles
        // Linear relationship: tidal level + 0.7 = tidal level in DEM
        tidalLevel = (Number(tidalLevel) - Number(0.7)).toFixed(2);
        const tidalLevelInFilename = (tidalLevel).toString().replace(/\./g, '_')
        const fileUrl = `${layerUrl}${config.URL_PREFIX}${tidalLevelInFilename}.geojson`;
        console.log(fileUrl);
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const geoJSONContent = await response.json();

            map.addSource(`${config.SOURCE_ID}`, {
                'type': 'geojson',
                'data': geoJSONContent
            })
            map.addLayer({
                'id': config.LAYER_ID,
                'type': config.LAYER_TYPE,
                'source': config.SOURCE_ID,
            });
            map.setPaintProperty(config.LAYER_ID, config.COLOR_PARAM, config.COLOR);
            map.setPaintProperty(config.LAYER_ID, config.OPACITY_PARAM, config.OPACITY);

        } catch (error) {
            console.error('Error fetching or parsing GeoJSON', error);
        }
    }

    loadGeoJSON();
}

async function removeLayer(map, configData, layer) {
    const config = configData.IMPACT[layer];
    const layerId = config.LAYER_ID;
    const sourceId = config.SOURCE_ID;
    // Also remove the associated layers before removing the source
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }


}

export { addLayerLocal, removeLayer, addRegionLayer, removeRegionLayer };