import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import ErrorBoundary from '../errorBoundary';

import { useConfig } from '../../ConfigContext'; 

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { area, threshold} = payload[0].payload; // Access the level value
        
        return (
            <div 
            className="custom-tooltip"
            style={{ 
                    padding: '8px',
                    paddingTop: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    color: 'white', 
                    // borderRadius: '4px',
                    fontSize: "14px",
                    }}
            >
                <p>{`Threshold Level: ${threshold} m`}</p>
                <p>{`Built Up Area: ${area} sq km`}</p>
            </div>
        );
    }
    return null;
};

const CustomMarker = ({ cx, cy, size, fill }) => {
    return <circle cx={cx} cy={cy} r={size} fill={fill} />;
};


const BuiltUpAreaToThresholdChart = ({ regionId }) => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (regionId) {
            fetchData("/api/analytics/impact-data/threshold-area", regionId);
        }
    }, [regionId]);

    const fetchData = async (endPoint, regionId) => {
        setLoading(true);
        try {        
            const response = await axios.get(`${dataServeUrl}${endPoint}`, {
                params: {
                    region_id: regionId
                }
        });

        const thresholdAreaData = await response.data;
        setData(thresholdAreaData)

        } catch (error) {
        console.error('Error fetching analytics data:', error);
        } finally {
        setLoading(false);
        }
    };

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;
    const ticks = [0, 2, 4, 6, 8];

    return (
      <div>
      {/* Debugging log */}
            
        <ResponsiveContainer width="100%" height={300}>
          {/* <ErrorBoundary> */}
            <ScatterChart
                margin={{
                            top: 15,
                            // right: 30,
                            // left: 20,
                            bottom: 30,
                        }}
            >
                <Scatter 
                    name="Built Up Area" 
                    dataKey="threshold" 
                    data={data} 
                    fill="#0081A7" 
                    shape={<CustomMarker size={4} fill={"#0081A7"}  />} 
                    // xAxisId="thresholdAxis"  
                    zAxis={12}
                />
                <XAxis 
                    domain={[0, 5]}
                    dataKey="area" 
                    type="number" 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    height={25}
                    label={{value: 'Threshold Levels(m)',
                            position: 'bottom',
                            fontSize: 12
                    }}
                    // xAxisId="thresholdAxis"
                />
                <YAxis 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}  // Ensures all ticks are displayed 
                    label={{ 
                        value: 'Threshold Levels (m)', 
                        angle: -90, 
                        dx: 10,
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                    }}
                />
                {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#5E6664"  strokeOpacity="50%" strokeDasharray="5 5" />
                    ))}
                <Tooltip content={<CustomTooltip />} />
            </ScatterChart>
          {/* </ErrorBoundary> */}
        </ResponsiveContainer>
      </div>
    );
};

export default BuiltUpAreaToThresholdChart;