import React, { useEffect, useState } from 'react';
import { LineChart, Line, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useConfig } from '../../ConfigContext';
import dayjs, { Dayjs } from 'dayjs';
import ErrorBoundary from '../errorBoundary';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { level } = payload[0].payload; // Access the level value

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

const HistoricalMeanChart = () => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataServeUrl}/api/analytics/historical-data/monthly-means`);
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

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;

    let lastDisplayedYear = null;

    //  // Find maximum level from data
    //  const maxLevel = Math.max(...data.map(d => d.level), 1.5);

    //  // Round maxLevel up to nearest 0.5
    //  const roundedMax = Math.ceil(maxLevel * 2) / 2;
 
    //  // Generate ticks from 0 to roundedMax in 0.5 intervals
    //  const ticks = Array.from({ length: Math.round(roundedMax / 0.5) + 1 }, (_, i) => i * 0.5);
    const ticks = [-1, 0, 1, 2, 3, 4]
    return (
        <ResponsiveContainer width="100%" height={300}>
             {/* <ErrorBoundary> */}
                <LineChart width="100%" height="100%" data={data}>
                    
                    <Line type="monotone" dataKey="level" stroke="#0081A7" dot={{strokeWidth: 0.5, r: 2, fill: '#54F2F2'}}/>
                    
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(tick) => {
                            const year = dayjs(tick).format('YYYY');
                            if (year === lastDisplayedYear) return ''; // ✅ Skip duplicate years but keep spacing
                            lastDisplayedYear = year;
                            return year;
                        }}
                    tickLine={false}
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    // axisLine={false}
                    interval={50}
                    /> 
                    <YAxis 
                    domain={[0, 1.5]} 
                    tickCount={3}
                    ticks={ticks} 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                            value: 'Meters (m)', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                        }}
                    />
                    {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#5E6664"  strokeOpacity="50%" strokeDasharray="5 5" />
                    ))}
                    <Tooltip content={<CustomTooltip />} />
                </LineChart>
            {/* </ErrorBoundary> */}
        </ResponsiveContainer>
    );
};

export default HistoricalMeanChart;