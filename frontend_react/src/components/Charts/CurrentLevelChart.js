import React, { useEffect, useState } from 'react';
import { useConfig } from '../../ConfigContext'; 
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    return <circle cx={cx} cy={cy} r={size} fill="red" stroke="red" strokeWidth={5} />;
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
                const formattedData = data.map(item => ({
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
        // fetchData('/api/analytics/predicted-data');
    }, [dataServeUrl]);

    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
    };

    const tickFormatter = (unixTime) => {
        return new Date(unixTime).toLocaleTimeString(); // Customize this format
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div>
      {/* Debugging log */}
      {console.log('Chart container height:', document.getElementById('chart-container')?.offsetHeight)}
            
        <ResponsiveContainer width="100%" height={310} >
            <ScatterChart>
                <Scatter name="Tidal Level" dataKey="level" data={realtimeData} fill="#6c5cdd" shape={<CustomMarker size={3} fill={"#6c5cdd"} />} />
                <Scatter name="Current Level" dataKey="level" data={[realtimeData[realtimeData.length - 1]]} stroke="#6c5cdd" fill="red" strokeWidth={5} shape={<CustomMarkerLast size={8} />} />
                {/* <Scatter name="Predicted Data" dataKey="level" data={predictedData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} /> */}
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="timestamp" domain={['dataMin', 'dataMax']} type="number" tickFormatter={tickFormatter} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
};

export default RealtimeLineChart;