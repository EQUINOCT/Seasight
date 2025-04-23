import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, Rectangle, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useConfig } from '../../ConfigContext';
import { ErrorBar } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import ErrorBoundary from '../errorBoundary';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const level = payload[0].payload['avg'];
        const error = payload[0].payload['error'];
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
                {/* add toFixed(2) here */}
                    <p style={{ margin: 0 }}>{`Mean Flooded Days: ${level}`}</p>
                    {error !== null && (
                        <p style={{ margin: 0 }}>{`± ${error}`}</p>
                    )}
                </div>
            );
        }
        return null;
    }
    return null;
};

const FrequencyBarChart = ({setMonth}) => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBarClick = (data) => {
        setMonth(data.stamp);
    }

    useEffect(() => {
        fetchData('/api/analytics/realtime-data/monthwise/frequency-means', 2, 0);
    }, [dataServeUrl]);

    const fetchData = async (endPoint, thresholdLevel, temporalValue) => {
        setLoading(true);
        try {
            
            const response = await axios.get(`${dataServeUrl}${endPoint}`, {
                params: {
                    threshold_level: thresholdLevel,
                    month: temporalValue
                }
        });

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedData = response.data.map(d => ({
        ...d,
        month: monthLabels[d.stamp - 1]  // if month is 1-based
        }));

        setData(formattedData);
        } catch (error) {
        console.error('Error fetching analytics data:', error);
        } finally {
        setLoading(false);
        }
    };

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;
    const ticks = [0, 5, 10, 15, 20];

    let lastDisplayedYear = null;
    // const ticks=[0.5, 1.0, 1.5, 2];
    

    return (
        <ResponsiveContainer width="100%" height={300}>
             {/* <ErrorBoundary> */}
                <BarChart 
                    width="100%"
                    height="100%"
                    data={data}
                    paddingLeft={0}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 10
                    }}
                > 
                    
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis 
                    dataKey="month"
                    tick={{ fill: '#5E6664', fontSize: 12}}
                    // ticks={months}
                    tickLine={false}
                    label={{ 
                        value: 'Months', 
                        position: 'center',
                        dy: 20,
                        style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                    }}
                    /> 
                    <YAxis  
                    tickCount={5}
                    ticks={ticks} 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                            value: 'Flooded Days', 
                            angle: -90, 
                            dx: 10,
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                        }}
                    />
                    {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#5E6664"  strokeOpacity="30%" strokeDasharray="5 5" />
                    ))}
                    <Bar 
                        type="monotone" 
                        dataKey="avg" 
                        fill='#488DA3' 
                        activeBar={<Rectangle fill="#54F2F2"/>}
                        onClick={handleBarClick}/>
                    <ErrorBar 
                        dataKey="error" 
                        width={4} 
                        strokeWidth={1.5} 
                        stroke="#333"
                        direction="y" 
                    />
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