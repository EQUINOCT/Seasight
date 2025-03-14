import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { ComposedChart, LineChart, Scatter, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import ErrorBoundary from '../errorBoundary';
import { useConfig } from '../../ConfigContext';
import {parseDate} from './CurrentLevelChart';
import CircularProgressIndicator from '../Misc/CircularProgressIndicator';



const MinimalRealtimeLevelChart = ({tidalLevel, selectedDate}) => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [realtimeData, setRealtimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(false);
    // const [max]

    useEffect(() => {
        const todayDate = new Date();
        if (selectedDate && selectedDate <= todayDate) {
            const startDate = new Date(selectedDate);
            const endDate = new Date(selectedDate);
            if (selectedDate < todayDate) {
                startDate.setDate(selectedDate.getDate() - 0.5);
                endDate.setDate(selectedDate.getDate() + 0.5);

            } else {
                startDate.setDate(selectedDate.getDate() - 1);
            }
            fetchData('/api/analytics/realtime-data/by-date-range', startDate, endDate);
        }
        else {
            setLoading(false);
            setNoData(true);
        }
    }, [selectedDate]);

    const fetchData = async (endPoint, startDate, endDate) => {
        setLoading(true);
        try {
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            
            const response = await axios.get(`${dataServeUrl}${endPoint}`, {
                params: {
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
        setNoData(true);
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

    // const timeFormatter = (unixTime) => {
    //     return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Customize this format
    // };

    // const dateFormatter = (unixTime) => {
    //     return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    // };


    // Generate ticks at **3-hour intervals**
    // const generateHourlyTicks = (timePeriod) => {
    //     const ticks = [];

    //     let tickTime = new Date(timePeriod[0]);
    //     tickTime.setMinutes(0, 0, 0);

    //     while (tickTime.getTime() <= timePeriod[1]) {
    //         ticks.push(tickTime.getTime());
    //         tickTime.setHours(tickTime.getHours() + 2); // Move forward by 2 hours
    //     }

    //     return ticks;
    // };

    // Generate **unique daily ticks** for the date axis
    // const generateDateTicks = (timePeriod) => {
    //     const ticks = [];

    //     let tickTime = new Date(timePeriod[0]);
    //     tickTime.setHours(0, 0, 0);

    //     while (tickTime.getTime() <= timePeriod[1]) {
    //         ticks.push(tickTime.getTime());
    //         tickTime.setDate(tickTime.getDate() + 1); // Move forward by 2 hours
    //     }

    //     return ticks;
    // };

    // const timePeriod = getTimePeriodFromData(realtimeData);
    // const timePeriod = [startDate, endDate];
    // const xAxisTimeTicks = generateHourlyTicks(timePeriod) || [];
    // const xAxisDateTicks = generateDateTicks(timePeriod) || [];

    if (loading) return <div>{CircularProgressIndicator}</div>;
    if (error) return <p>Error: {error}</p>;
    if (noData) return <p>No Data for Selected Date</p>;

    console.log(realtimeData);
    // const ticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8];

    const lastRealtimePoint = realtimeData.length > 0 ? [realtimeData[realtimeData.length - 1]] : [];
    // const xDomain = xAxisTimeTicks.length > 1
    // ? [
    //     (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
    //     (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
    //   ]
    // : ['dataMin', 'dataMax']; // Fallback if xAxisTimeTicks is empty
    const CustomMarker = ({ cx, cy, size, fill }) => {
        return <circle cx={cx} cy={cy} r={size} fill={fill} />;
    };

    return (
      <div>
      {/* Debugging log */}
            
        <ResponsiveContainer minWidth={150} width="100%" height={200}  >
          {/* <ErrorBoundary> */}
            <ComposedChart>
                <Line 
                    type="cardinal"
                    name="Tidal Level" 
                    dataKey="tidal_level" 
                    data={realtimeData} 
                    stroke="#91ddf8"
                    dot={false}
                    // xAxisId="timeAxis"  
                />
                <Scatter 
                    name="Current Level" 
                    dataKey="tidal_level" 
                    data={realtimeData} 
                    stroke="#54F2F2" fill="#54F2F2" 
                    strokeWidth={8} 
                    shape={<CustomMarker size={8} fill={"#54F2F2"}/>}  
                    xAxisId="timeAxis" 
                />
                {/* <XAxis 
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
                /> */}
                {/* <YAxis 
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
                /> */}
                {/* {ticks.map(tick => (
                    <ReferenceLine 
                    key={tick} y={tick} 
                    stroke="#E4F7F2"  
                    strokeOpacity="50%" 
                    strokeDasharray="5 5" 
                    xAxisId="timeAxis"
                    />
                ))} */}
                {/* <Tooltip content={<CustomTooltip />} />
                <Legend 
                    layout="horizontal" 
                    align="left" 
                    verticalAlign="top" // Positioned at top-left
                    iconSize={12}
                    wrapperStyle={{ left: 75, top: -15, fontSize: '12px'}} 
                /> */}
            </ComposedChart>
          {/* </ErrorBoundary> */}
        </ResponsiveContainer>
      </div>
    );
};

export default MinimalRealtimeLevelChart;
