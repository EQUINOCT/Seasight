import React, { useEffect, useState } from 'react';
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

const DecadalMeanChart = () => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataServeUrl}/api/analytics/historical-data/decadal-means`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataServeUrl]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    let lastDisplayedYear = null;
    const ticks=[0.5, 1.0, 1.5];

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
                    <Bar type="monotone" dataKey="mean_level" fill='#2db8b8' activeBar={<Rectangle fill="pink"/>}/>
                    
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis 
                    dataKey="decade"
                    label={{ 
                        value: 'Years', 
                        position: 'center',
                        dy: 35,
                        style: { textAnchor: 'middle', fill: '#E4F7F2', fontSize: 15 }
                    }}
                    /> 
                    <YAxis 
                    domain={[0, 1.5]} 
                    tickCount={3}
                    ticks={ticks} 
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                            value: 'Meters (m)', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#E4F7F2', fontSize: 15 }
                        }}
                    />
                    {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#E4F7F2"  strokeOpacity="50%" strokeDasharray="5 5" />
                    ))}
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        content={<CustomTooltip />} 
                    />
                </BarChart>
            {/* </ErrorBoundary> */}
        </ResponsiveContainer>
    );
};

export default DecadalMeanChart;