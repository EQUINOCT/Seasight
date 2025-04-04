import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { ComposedChart, LineChart, Scatter, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';
import ErrorBoundary from '../errorBoundary';
import { useConfig } from '../../ConfigContext';
import {parseDate} from './CurrentLevelChart';
import CircularProgressIndicator from '../Misc/CircularProgressIndicator';

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
                    padding: '5px',
                    paddingTop: '1px',
                    // backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    // color: 'white', 
                    // borderRadius: '4px',
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

const MinimalRealtimeLevelChart = ({tidalLevel, timeStampAtLevel, selectedDate}) => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [realtimeData, setRealtimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(false);
    // const [max]
    const todayDate = new Date();
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    if (selectedDate < todayDate) {
        startDate.setDate(selectedDate.getDate() - 0.5);
        endDate.setDate(selectedDate.getDate() + 1);
        

    } else {
        startDate.setDate(selectedDate.getDate() - 1);
    }

    useEffect(() => {
        const todayDate = new Date();
        if (selectedDate && selectedDate <= todayDate) {
            const startDate = new Date(selectedDate);
            const endDate = new Date(selectedDate);
            if (selectedDate < todayDate) {
                startDate.setDate(selectedDate.getDate() - 0.5);
                endDate.setDate(selectedDate.getDate() + 1);
               

            } else {
                startDate.setDate(selectedDate.getDate() - 1);
            }
            console.log(selectedDate, startDate, endDate);
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

    const timeFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Customize this format
    };

    // const dateFormatter = (unixTime) => {
    //     return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    // };


    const generateHourlyTicks = (timePeriod) => {
        const ticks = [];

        let tickTime = new Date(timePeriod[0]);
        tickTime.setMinutes(0, 0, 0);

        while (tickTime.getTime() <= timePeriod[1]) {
            ticks.push(tickTime.getTime());
            tickTime.setHours(tickTime.getHours() + 2); // Move forward by 2 hours
        }

        return ticks;
    };


    // const timePeriod = getTimePeriodFromData(realtimeData);
    const timePeriod = [startDate, endDate];
    const xAxisTimeTicks = generateHourlyTicks(timePeriod) || [];
    // const xAxisDateTicks = generateDateTicks(timePeriod) || [];

    if (loading) return <div>{CircularProgressIndicator}</div>;
    if (error) return <p>Error: {error}</p>;
    if (noData) return <p>No Data for Selected Date</p>;

    const ticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8];

    const lastRealtimePoint = realtimeData.length > 0 ? [realtimeData[realtimeData.length - 1]] : [];
    const xDomain = xAxisTimeTicks.length > 1
    ? [
        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
      ]
    : ['dataMin', 'dataMax']; // Fallback if xAxisTimeTicks is empty
    const CustomMarker = ({ cx, cy, size, fill }) => {
        return <circle cx={cx} cy={cy} r={size} fill={fill} />;
    };

    const scatterData = [{id: 8000, timestamp: timeStampAtLevel.getTime(), tidal_level: tidalLevel}]


    return (
      <div style={{ 
    //   border: '1px solid #ccc', 
    //   borderRadius: '8px',
      padding: '5px',
        }}>
      {/* Debugging log */}
            
            <ResponsiveContainer minWidth={150} width="100%" height={150} >
          {/* <ErrorBoundary> */}
            <ComposedChart>
                <Line 
                    type="cardinal"
                    name="Tidal Level" 
                    dataKey="tidal_level" 
                    data={realtimeData} 
                    fill="#0081A7" 
                    dot={false}
                    // shape={<CustomMarker size={1} fill={"#0081A7"}  />} 
                    xAxisId="timeAxis"  
                />
                <Scatter 
                    name="Current Level" 
                    dataKey="tidal_level" 
                    data={scatterData} 
                    stroke="#54F2F2" fill="#54F2F2" 
                    strokeWidth={8} 
                    shape={<CustomMarker size={4} fill={"#54F2F2"}/>}  
                    xAxisId="timeAxis" 
                />
                <ReferenceLine 
                    x={scatterData[0]['timestamp']} 
                    stroke="#E4F7F2"
                    strokeOpacity="100%" 
                    xAxisId="timeAxis"
                    />
                <XAxis 
                    dataKey="timestamp" 
                    domain={[
                        (dataMin) => dataMin - 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0]), 
                        (dataMax) => dataMax + 0.04 * (xAxisTimeTicks[xAxisTimeTicks.length - 1] - xAxisTimeTicks[0])
                    ]}
                    type="number" 
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    xAxisId="timeAxis"
                />
            </ComposedChart>    
        </ResponsiveContainer>
      </div>
    );
};

export default MinimalRealtimeLevelChart;
