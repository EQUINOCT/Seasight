import React, { useEffect, useState } from 'react';
import { useConfig } from '../../ConfigContext'; 
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { level } = payload[0].payload; // Access the level value
        return (
            <div className="custom-tooltip">
                <p>{`Tidal Level: ${level} m`}</p>
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

    useEffect(() => {
        const fetchData = async (endpoint) => {
            try {
                const response = await fetch(`${dataServeUrl}${endpoint}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const now = Date.now();
                const twelveHoursAgo = now - 12 * 60 * 60 * 1000;

                const formattedData = data
                .map(item => ({
                    ...item,
                    timestamp: parseDate(item.timestamp),
                }));
                
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
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
    };

    const timeFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Customize this format
    };

    const dateFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Generate ticks at **3-hour intervals**
    const generateHourlyTicks = (data) => {
        if (!data.length) return [];
        const minTime = data[0].timestamp;
        const maxTime = data[data.length - 1].timestamp;
        const interval = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        let ticks = [];
        for (let t = minTime; t <= maxTime; t += interval) {
            ticks.push(t);
        }
        return ticks;
    };

    // Generate **unique daily ticks** for the date axis
    const generateDateTicks = (data) => {
        if (!data.length) return [];
        const uniqueDays = new Set();
        return data
            .map((item) => {
                const day = new Date(item.timestamp).setHours(0, 0, 0, 0); // Normalize to midnight
                if (!uniqueDays.has(day)) {
                    uniqueDays.add(day);
                    return day;
                }
                return null;
            })
            .filter((day) => day !== null);
    };

    const xAxisTimeTicks = generateHourlyTicks(realtimeData);
    const xAxisDateTicks = generateDateTicks(realtimeData);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const ticks=[0.5, 1.0, 1.5, 2, 2.5];

    return (
      <div>
      {/* Debugging log */}
      {console.log('Chart container height:', document.getElementById('chart-container')?.offsetHeight)}
            
        <ResponsiveContainer width="100%" height={310} >
            <ScatterChart>
                <Scatter name="Tidal Level" dataKey="level" data={realtimeData} fill="#0081A7" shape={<CustomMarker size={3} fill={"#0081A7"} />} xAxisId="timeAxis"  />
                <Scatter name="Current Level" dataKey="level" data={[realtimeData[realtimeData.length - 1]]} stroke="#54F2F2" fill="#54F2F2" strokeWidth={8} shape={<CustomMarker size={8} fill={"#54F2F2"}/>}  xAxisId="timeAxis" />
                {/* <Scatter name="Predicted Data" dataKey="level" data={predictedData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} /> */}
                
                <XAxis 
                    dataKey="timestamp" 
                    domain={[
                        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
                        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
                    ]}
                    type="number" 
                    tickFormatter={timeFormatter} 
                    ticks={xAxisTimeTicks}
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    height={30}
                    xAxisId="timeAxis"
                />
                <XAxis 
                    dataKey="timestamp"
                    domain={['dataMin', 'dataMax']}
                    type="number"
                    tickFormatter={dateFormatter}
                    axisLine={false}
                    ticks={xAxisDateTicks}
                    tick={{ fill: '#E4F7F2', fontSize: 12 }}
                    tickLine={false}
                    height={20}
                    xAxisId="dateAxis"
                />
                <YAxis 
                    domain={[0.5, 2.5]}  // Ensures Y values range between 0.5 and 1.5
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
                <Legend />
            </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
};

export default RealtimeLineChart;