import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
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
                          {formattedDate} <br/> {formattedTime}
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

const RealtimeAnalytics = ({ startDate, endDate }) => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [realtimeData, setRealtimeData] = useState([]);
    const [predictedData, setPredictedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState();

    const [pagination, setPagination] = useState({
    offset: 0,
    limit: 5000
    });

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
            // Reset pagination when date range changes
            setPagination({ ...pagination, offset: 0 });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchData();
        }
    }, [pagination]);

    const fetchData = async () => {
        setLoading(true);
        try {
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();
        
        const response = await axios.get(`${dataServeUrl}/api/analytics/realtime-data/by-date-range`, {
            params: {
            offset: pagination.offset,
            limit: pagination.limit,
            start_date: startDateStr,
            end_date: endDateStr
            }
        });

        const formattedData = await response.data
                .map(item => ({
                    ...item,
                    timestamp: parseDate(item.timestamp),
                }))
                .filter(item => item.timestamp !== null && !isNaN(item.timestamp) && item.tidal_level <= 1.75);

        setRealtimeData(formattedData);
        } catch (error) {
        console.error('Error fetching analytics data:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setPagination({
        ...pagination,
        offset: pagination.offset + pagination.limit
        });
    };


    const parseDate = (dateString) => {
    if (!dateString) return null;
    
    try {
        // For ISO format strings (like "2025-03-11T14:30:00Z")
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
        return date.getTime();
        }       
        
        // Fall back to your custom parsing for other formats
        const parts = dateString.split(' ');
        if (parts.length !== 2) return null;
        const [datePart, timePart] = parts;
        const dateSegments = datePart.split('-').map(Number);
        const timeSegments = timePart.split(':').map(Number);
        if (dateSegments.length !== 3 || timeSegments.length < 2) return null;
        const [year, month, day] = dateSegments;
        const [hours, minutes, seconds = 0] = timeSegments;
        return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    } catch (error) {
        console.error(`Error parsing date: ${dateString}`, error);
        return null;
    }
    };

    const timeFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Customize this format
    };

    const dateFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getTimePeriodFromData = (data) => {
        if (!data || data.length === 0) return [null, null];

        const validData = data.filter(item => !isNaN(item.timestamp)); // Ensure valid timestamps
        if (validData.length === 0) return [null, null];

        const startTime = validData[0].timestamp;
        const endTime = validData[validData.length - 1].timestamp;
        return [startTime, endTime];
    }


    // Generate ticks at **3-hour intervals**
    const generateHourlyTicks = (timePeriod) => {
        // if (!data || data.length === 0) return [];

        // const validData = data.filter(item => !isNaN(item.timestamp)); // Ensure valid timestamps
        // if (validData.length === 0) return [];

        // const startTime = validData[0].timestamp;
        // const endTime = validData[validData.length - 1].timestamp;
        const ticks = [];

        let tickTime = new Date(timePeriod[0]);
        tickTime.setMinutes(0, 0, 0);

        while (tickTime.getTime() <= timePeriod[1]) {
            ticks.push(tickTime.getTime());
            tickTime.setHours(tickTime.getHours() + 2); // Move forward by 2 hours
        }

        return ticks;
    };

    // Generate **unique daily ticks** for the date axis
    const generateDateTicks = (timePeriod) => {
        const ticks = [];

        let tickTime = new Date(timePeriod[0]);
        tickTime.setHours(0, 0, 0);

        while (tickTime.getTime() <= timePeriod[1]) {
            ticks.push(tickTime.getTime());
            tickTime.setDate(tickTime.getDate() + 1); // Move forward by 2 hours
        }

        return ticks;
    };

    const timePeriod = getTimePeriodFromData(realtimeData);
    const xAxisTimeTicks = generateHourlyTicks(timePeriod) || [];
    const xAxisDateTicks = generateDateTicks(timePeriod) || [];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const ticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8];

    const lastRealtimePoint = realtimeData.length > 0 ? [realtimeData[realtimeData.length - 1]] : [];
    const xDomain = xAxisTimeTicks.length > 1
    ? [
        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
      ]
    : ['dataMin', 'dataMax']; // Fallback if xAxisTimeTicks is empty

    return (
      <div>
      {/* Debugging log */}
            
        <ResponsiveContainer width="100%" height={400} >
          {/* <ErrorBoundary> */}
            <ScatterChart>
                <Scatter 
                    name="Tidal Level" 
                    dataKey="tidal_level" 
                    data={realtimeData} 
                    fill="#0081A7" 
                    shape={<CustomMarker size={1} fill={"#0081A7"}  />} 
                    xAxisId="timeAxis"  
                />
                <Scatter 
                    name="Current Level" 
                    dataKey="tidal_level" 
                    data={lastRealtimePoint} 
                    stroke="#54F2F2" fill="#54F2F2" 
                    strokeWidth={8} 
                    shape={<CustomMarker size={8} fill={"#54F2F2"}/>}  
                    xAxisId="timeAxis" 
                />
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
          {/* </ErrorBoundary> */}
        </ResponsiveContainer>
      </div>
    );
};

export default RealtimeAnalytics;