import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ComposedChart, Scatter, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
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

const RealtimeAnalytics = ({ startDate, endDate, projected }) => {
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
            fetchData('/api/analytics/realtime-data/by-date-range', startDate, endDate);
            
            const currentDateTime = new Date();
            fetchData('/api/analytics/predicted-data/by-date-range', currentDateTime, endDate);
            // Reset pagination when date range changes
            setPagination({ ...pagination, offset: 0 });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchData('/api/analytics/realtime-data/by-date-range', startDate, endDate);
            
            fetchData('/api/analytics/predicted-data/by-date-range', startDate, endDate);
        }
    }, [pagination]);

    const fetchData = async (endPoint, startDate, endDate) => {
        setLoading(true);
        try {
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            
            const response = await axios.get(`${dataServeUrl}${endPoint}`, {
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

        if (endPoint.includes('realtime')) {
            setRealtimeData(formattedData);
        } else if (endPoint.includes('predicted')) {
            setPredictedData(formattedData);
        }
        } catch (error) {
        console.error('Error fetching analytics data:', error);
        } finally {
        setLoading(false);
        }
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
        var options = {hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}
        return new Date(unixTime).toLocaleTimeString([], options); // Customize this format
    };

    const dateFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };


    // Generate ticks at **2-hour intervals**
    const generateHourlyTicks = (timePeriod) => {
        const ticks = [];

        let tickTime = new Date(timePeriod[0]);
        tickTime.setMinutes(0, 0, 0);

        while (tickTime.getTime() <= timePeriod[1]) {
            ticks.push(tickTime.getTime());
            tickTime.setHours(tickTime.getHours() + 3); // Move forward by 3 hours
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

    // const timePeriod = getTimePeriodFromData(realtimeData);
    const timePeriod = [startDate, endDate];
    const xAxisTimeTicks = generateHourlyTicks(timePeriod) || [];
    const xAxisDateTicks = generateDateTicks(timePeriod) || [];

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;

    const ticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8];

    const lastRealtimePoint = realtimeData.length > 0 ? [realtimeData[realtimeData.length - 1]] : [];
    const xDomain = xAxisTimeTicks.length > 1
    ? [
        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
      ]
    : ['dataMin', 'dataMax']; // Fallback if xAxisTimeTicks is empty    
    return (
      <div 
    //   style={{ 
    //   border: '1px solid #ccc', 
    //   borderRadius: '8px',
    //   padding: '8px',
    //   }}
        >
      {/* Debugging log */}
            
        <ResponsiveContainer width="100%" height={325}>
          {/* <ErrorBoundary> */}
            <ComposedChart
                margin={{
                            top: 15,
                            // right: 30,
                            // left: 20,
                            bottom: 10,
                        }}
            >
                <Scatter 
                    name="Tidal Level" 
                    dataKey="tidal_level" 
                    data={realtimeData} 
                    fill="#0081A7" 
                    shape={<CustomMarker size={1} fill={"#0081A7"}  />} 
                    xAxisId="timeAxis"  
                    zAxis={12}
                />
                <Scatter 
                    name="Current Level" 
                    dataKey="tidal_level" 
                    data={lastRealtimePoint} 
                    stroke="#0A2463 " fill="#0A2463" 
                    strokeWidth={8} 
                    shape={<CustomMarker size={8} fill={"#0A2463"}/>}  
                    xAxisId="timeAxis" 
                    zAxis={12}
                />
                {projected && (
                <>
                <Line 
                    name="Predicted Tidal Level"
                    type="monotone" 
                    data={predictedData}
                    dataKey="tidal_level" 
                    stroke=" #FFA630" 
                    dot={{
                        strokeWidth: 0.7, 
                        r: 2, 
                        fill: " #FFA630"
                    }}
                    xAxisId="timeAxis"
                />
                </>
                )}
                <XAxis 
                    dataKey="timestamp" 
                    domain={[
                        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
                        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
                    ]}
                    type="number" 
                    tickFormatter={timeFormatter} 
                    ticks={xAxisTimeTicks.length > 0 ? xAxisTimeTicks: undefined}
                    tick={{ fill: '#5E6664', fontSize: 12 }}
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
                    tick={{ fill: '#5E6664', fontSize: 12}}
                    tickLine={false}
                    height={18}
                    xAxisId="dateAxis"
                />
                <YAxis 
                    domain={[0, 1.8]}  // Ensures Y values range between 0.5 and 1.5
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}  // Ensures all ticks are displayed
                    ticks={ticks}  // Custom tick values at 0.5 intervals
                    label={{ 
                        value: 'Meters (m)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                    }}
                />
                {ticks.map(tick => (
                    <ReferenceLine 
                    key={tick} y={tick} 
                    stroke="#6E7674"  
                    strokeOpacity="60%" 
                    strokeDasharray="5 5" 
                    xAxisId="timeAxis"
                    z="-10"
                    />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    layout="horizontal" 
                    align="left" 
                    verticalAlign="top" // Positioned at top-left
                    iconSize={12}
                    wrapperStyle={{ left: 50, top: 0, fontSize: '12px'}} 
                />
            </ComposedChart>
          {/* </ErrorBoundary> */}
        </ResponsiveContainer>
      </div>
    );
};

export default RealtimeAnalytics;