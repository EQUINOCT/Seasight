import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, Rectangle, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useConfig } from '../../ConfigContext';
import dayjs, { Dayjs } from 'dayjs';
import ErrorBoundary from '../errorBoundary';


const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const level = payload[0].payload['mean_level']; // Access the level value
        // const dateTime = new Date(timestamp);
        // const formattedDate = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        // const formattedTime = dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


        if (typeof level === 'number' && !isNaN(level)) {
            return (
                <div 
                className="custom-tooltip"
                style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    color: 'white', 
                    padding: '8px', 
                    borderRadius: '4px',
                    fontSize: "14px",
                    }}
                >
                    <p style={{ margin: 0 }}>{`Mean Level: ${level.toFixed(2)} m`}</p>
                </div>
            );
        }
        return null;
    }
    return null;
};

const FrequencyBarChart = () => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData('/api/analytics/realtime-data/monthwise/frequency-means', 3);
    }, [dataServeUrl]);

    const fetchData = async (endPoint, thresholdLevel) => {
        setLoading(true);
        try {
            
            const response = await axios.get(`${dataServeUrl}${endPoint}`, {
                params: {
                    threshold_level: thresholdLevel
                }
        });

        const formattedData = await response.data;

        setData(formattedData);
        } catch (error) {
        console.error('Error fetching analytics data:', error);
        } finally {
        setLoading(false);
        }
    };

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;

    let lastDisplayedYear = null;
    // const ticks=[0.5, 1.0, 1.5, 2];
    console.log(data);

    return (
        <ResponsiveContainer width="100%" height={330}>
             {/* <ErrorBoundary> */}
                <BarChart 
                    width="100%"
                    height="100%"
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}
                > 
                    
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis 
                    dataKey="month"
                    tick={{ fill: '#5E6664', fontSize: 12}}
                    label={{ 
                        value: 'Years', 
                        position: 'center',
                        dy: 35,
                        style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                    }}
                    /> 
                    <YAxis  
                    // tickCount={3}
                    // ticks={ticks} 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    // label={{ 
                    //         value: 'Frequency', 
                    //         angle: -90, 
                    //         position: 'insideLeft', 
                    //         style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 15 }
                    //     }}
                    />
                    {/* {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#5E6664"  strokeOpacity="30%" strokeDasharray="5 5" />
                    ))} */}
                    <Bar type="monotone" dataKey="avg" fill='#488DA3' activeBar={<Rectangle fill="#54F2F2"/>}/>
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        content={<CustomTooltip />} 
                    />
                </BarChart>
            {/* </ErrorBoundary> */}
        </ResponsiveContainer>
    );
};

export default FrequencyBarChart;