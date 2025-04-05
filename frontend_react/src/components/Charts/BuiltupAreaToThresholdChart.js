import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import ErrorBoundary from '../errorBoundary';

import { useConfig } from '../../ConfigContext'; 

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { tidal_level, timestamp } = payload[0].payload; // Access the level value
        
        const dateTime = timestamp ? new Date(timestamp) : null;
        const formattedDate = dateTime
            ? dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'N/A';
        const formattedTime = dateTime
            ? dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})
            : 'N/A';

        return (
            <div 
            className="custom-tooltip"
            style={{ 
                    padding: '8px',
                    paddingTop: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontSize: "14px",
                    }}
            >
                <p>{`Tidal Level: ${tidal_level} m`}</p>
                <p style={{ margin: "0px 0 0", fontSize: "12px", opacity: 0.8 }}>
                          {formattedDate} <br/> {formattedTime} IST
                </p>
            </div>
        );
    }
    return null;
};

const CustomMarker = ({ cx, cy, size, fill }) => {
    return <circle cx={cx} cy={cy} r={size} fill={fill} />;
};

const CustomMarkerLast = ({ cx, cy, size }) => {
    return <circle cx={cx} cy={cy} r={size} fill="red" stroke="red" strokeWidth={3} />;
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

    return (
      <div 
      style={{ 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      padding: '8px',
      }}
        >
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
                    dataKey="area" 
                    data={data} 
                    fill="#0081A7" 
                    shape={<CustomMarker size={4} fill={"#0081A7"}  />} 
                    // xAxisId="thresholdAxis"  
                    zAxis={12}
                />
                <XAxis 
                    dataKey="threshold" 
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
                        value: 'Built Up Area (SQ KM)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
            </ScatterChart>
          {/* </ErrorBoundary> */}
        </ResponsiveContainer>
      </div>
    );
};

export default BuiltUpAreaToThresholdChart;