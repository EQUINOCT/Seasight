import React, { useEffect, useState } from 'react';
import { useConfig } from '../../ConfigContext'; 
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import ErrorBoundary from '../errorBoundary';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { level, timestamp } = payload[0].payload; // Access the level value
        const dateTime = new Date(timestamp);
        const formattedDate = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const formattedTime = dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return (
            <div className="custom-tooltip">
                <p>{`Tidal Level: ${level} `}</p>
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

const RealtimeLineChart = () => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [realtimeData, setRealtimeData] = useState([]);
    const [predictedData, setPredictedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState();

    useEffect(() => {
        const fetchData = async (endpoint) => {
            try {
                const response = await fetch(`${dataServeUrl}${endpoint}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(`Fetched data from ${endpoint}:`, data);

                const formattedData = data
                .map(item => ({
                    ...item,
                    timestamp: parseDate(item.timestamp),
                }))
                .filter(item => item.timestamp !== null && !isNaN(item.timestamp)  && item.level <= 1.75);
                
                console.log('Formatted data:', formattedData);

                if (endpoint.includes('realtime')) {
                    setRealtimeData(formattedData);
                } else if (endpoint.includes('predicted')) {
                    setPredictedData(formattedData);
                }
                
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData('/api/analytics/realtime-data');
        fetchData('/api/analytics/predicted-data');
    }, [dataServeUrl]);

    const parseDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
    
        const parts = dateString.split(' ');
        if (parts.length !== 2) return null;
    
        const [datePart, timePart] = parts;
        const dateSegments = datePart.split('-').map(Number);
        const timeSegments = timePart.split(':').map(Number);
    
        if (dateSegments.length !== 3 || timeSegments.length < 2) return null;
    
        const [year, month, day] = dateSegments;
        const [hours, minutes, seconds = 0] = timeSegments;
    
        const timestamp = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    
        if (isNaN(timestamp)) {
            console.error(`Invalid timestamp: ${dateString}`);
            return null;
        }
    
        return timestamp;
    };

    const timeFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Customize this format
    };

    const dateFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Generate ticks at **3-hour intervals**
    const generateHourlyTicks = (data) => {
        if (!data || data.length === 0) return [];

        const validData = data.filter(item => !isNaN(item.timestamp)); // Ensure valid timestamps
        if (validData.length === 0) return [];

        const now = Date.now();
        const start = now - 24 * 60 * 60 * 1000;
        const ticks = [];

        let tickTime = new Date(start);
        tickTime.setMinutes(0, 0, 0);

        while (tickTime.getTime() <= now) {
            ticks.push(tickTime.getTime());
            tickTime.setHours(tickTime.getHours() + 2); // Move forward by 2 hours
        }

        return ticks;
    };

    // Generate **unique daily ticks** for the date axis
    const generateDateTicks = (data) => {
        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;
        return [
            new Date(yesterday).setHours(0, 0, 0, 0),
            new Date(now).setHours(0, 0, 0, 0),
        ];
    };

    const xAxisTimeTicks = generateHourlyTicks(realtimeData) || [];
    const xAxisDateTicks = generateDateTicks(realtimeData) || [];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const ticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8];
    console.log('xAxisTimeTicks:', xAxisTimeTicks);
    console.log('xAxisDateTicks:', xAxisDateTicks);

    const lastRealtimePoint = realtimeData.length > 0 ? [realtimeData[realtimeData.length - 1]] : [];
    const xDomain = xAxisTimeTicks.length > 1
    ? [
        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
      ]
    : ['dataMin', 'dataMax']; // Fallback if xAxisTimeTicks is empty

    console.log('Predicted Data:', predictedData);
    console.log('Timestamps:', realtimeData.map(d => d.timestamp));
    console.log('X-Axis Time Ticks:', xAxisTimeTicks);
    console.log('X-Axis Date Ticks:', xAxisDateTicks);
    console.log('Realtime Data:', realtimeData);
    console.log('Last Realtime Point:', realtimeData.length > 0 ? realtimeData[realtimeData.length - 1] : 'No data');

    return (
      <div>
      {/* Debugging log */}
      {console.log('Chart container height:', document.getElementById('chart-container')?.offsetHeight)}
            
        <ResponsiveContainer width="100%" height={310} >
          <ErrorBoundary>
            <ScatterChart>
                <Scatter 
                    name="Tidal Level" 
                    dataKey="level" 
                    data={realtimeData} 
                    fill="#0081A7" 
                    shape={<CustomMarker size={1} fill={"#0081A7"}  />} 
                    xAxisId="timeAxis"  
                />
                <Scatter 
                    name="Current Level" 
                    dataKey="level" 
                    data={lastRealtimePoint} 
                    stroke="#54F2F2" fill="#54F2F2" 
                    strokeWidth={8} 
                    shape={<CustomMarker size={8} fill={"#54F2F2"}/>}  
                    xAxisId="timeAxis" 
                />
                {/* <Scatter name="Predicted Data" dataKey="level" data={predictedData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} /> */}
                
                <XAxis 
                    dataKey="timestamp" 
                    domain={[
                        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
                        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
                    ]}
                    type="number" 
                    tickFormatter={timeFormatter} 
                    ticks={xAxisTimeTicks.length > 0 ? xAxisTimeTicks: undefined}
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    height={25}
                    xAxisId="timeAxis"
                />
                <XAxis 
                    dataKey="timestamp"
                    domain={xDomain}
                    type="number"
                    tickFormatter={dateFormatter}
                    axisLine={false}
                    ticks={xAxisDateTicks.length > 0 ? xAxisDateTicks: undefined}
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    height={18}
                    xAxisId="dateAxis"
                />
                <YAxis 
                    domain={[0, 1.8]}  // Ensures Y values range between 0.5 and 1.5
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}  // Ensures all ticks are displayed
                    ticks={ticks}  // Custom tick values at 0.5 intervals
                    label={{ 
                        value: 'Meters (m)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: '#E4F7F2', fontSize: 12 }
                    }}
                />
                {ticks.map(tick => (
                    <ReferenceLine 
                    key={tick} y={tick} 
                    stroke="#E4F7F2"  
                    strokeOpacity="50%" 
                    strokeDasharray="5 5" 
                    xAxisId="timeAxis"
                    />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    layout="horizontal" 
                    align="left" 
                    verticalAlign="top" // Positioned at top-left
                    iconSize={12}
                    wrapperStyle={{ left: 75, top: -15, fontSize: '12px'}} 
                />
            </ScatterChart>
          </ErrorBoundary>
        </ResponsiveContainer>
      </div>
    );
};

export default RealtimeLineChart;