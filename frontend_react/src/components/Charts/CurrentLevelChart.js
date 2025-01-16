// import { format } from 'maplibre-gl';
// import { useConfig } from '../../ConfigContext'; 
// import { LineChart, Line, Scatter, ScatterChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 700, pv: 2400, amt: 2400}, {name: 'Page C', uv: 100, pv: 2400, amt: 2400}, ];



// // console.log(predicted_data);

// // Function to convert dd-mm-YYYY HH:MM to Unix timestamp in milliseconds

// const parseDate = (dateString) => {
//       const [datePart, timePart] = dateString.split(' ');
//       const [year, month, day] = datePart.split('-').map(Number);
//       const [hours, minutes, seconds] = timePart.split(':').map(Number);
//       return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
// };

// const parseDatePred = (dateString) => {
//       const [datePart, timePart] = dateString.split(' ');
//       const [day, month, year] = datePart.split('-').map(Number);
//       const [hours, minutes, seconds] = timePart.split(':').map(Number);
//       return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
// };

// // Function to format the timestamp for the x-axis
// const tickFormatter = (unixTime) => {

//       return new Date(unixTime).toLocaleTimeString(); // You can customize this format
// };

// const formattedData = realtimeData.map(item => ({
//       ...item,
//       timestamp: parseDate(item.timestamp),
// }));

// // const formattedPredData = predictedData.map(item => ({
// //       ...item,
// //       timestamp: parseDatePred(item.timestamp),
// // }));

// const CustomTooltip = ({ active, payload }) => {
//       if (active && payload && payload.length) {
//             const { level } = payload[0].payload; // Access the level value
//             return (
//                   <div className="custom-tooltip">
//                         <p>{`Tidal Level: ${level} m`}</p>
//                   </div>
//             );
//       }
//       return null;
// };

// // const CustomTooltipPred = ({ active, payload }) => {
// //       if (active && payload && payload.length) {
// //             const { level } = payload[0].payload; // Access the level value
// //             return (
// //                   <div className="custom-tooltip">
// //                         <p>{`Projected Level: ${level} m`}</p>
// //                   </div>
// //             );
// //       }
// //       return null;
// // };
// // Custom Marker Component

// const CustomMarker = ({ cx, cy, size, fill }) => {
//       return (
//             <circle cx={cx} cy={cy} r={size} fill={fill} />
//       );
// };

// const CustomMarkerLast = ({ cx, cy, size }) => {
//       return (
//             <circle cx={cx} cy={cy} r={size} fill="red" stroke="red" strokeWidth={5} />
//       );
// };

// const renderRealtimeLineChart = async () => {
//       const { config } = useConfig();
//       const dataServeUrl = config[process.env.ENVIRONMENT].DATA_SERVE_ENDPOINT;

//       const realtimeData = await fetch(`${dataServeUrl}/api/analytics/realtime-data`)
//             .then(response => response.json());

//       const predictedData = await fetch(`${dataServeUrl}/api/analytics/predicted-data`)
//             .then(response => response.json());




//       <ResponsiveContainer width="100%" height={380}>
//             <ScatterChart width="100%" height="100%">
//                   <Scatter name="Tidal Level" type="monotone" dataKey="level" data={formattedData} fill="#6c5cdd" shape={<CustomMarker size={3} fill={"#6c5cdd"} />} />
//                   <Scatter name="Current Level" type="monotone" dataKey="level" data={[formattedData[formattedData.length - 1]]} stroke="#6c5cdd" fill="red" strokeWidth={5} shape={<CustomMarkerLast size={8} />} />
//                   <CartesianGrid stroke="#ccc" />
//                   <XAxis
//                         dataKey="timestamp"
//                         domain={['dataMin', 'dataMax']}
//                         type="number"
//                         tickFormatter={tickFormatter} // Format the timestamp
//                   />
//                   <YAxis />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   {/* <Line 
//                         type="monotone" 
//                         data={formattedPredData} 
//                         dataKey="level" 
//                         stroke="#ffb201"
//                         strokeWidth={2} 
//                         dot={true} // Disable dots on the line
//                   /> */}
//                   {/* <Scatter name="Predicted Data" dataKey="level" data={formattedPredData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} /> */}
//                   {/* <Line>data={formattedPredData}</Line> */}
//             </ScatterChart>

//       </ResponsiveContainer>
// };

// export { renderRealtimeLineChart }

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
    const dataServeUrl = config[process.env.REACT_APP_ENVIRONMENT].DATA_SERVE_ENDPOINT;

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
        fetchData('/api/analytics/predicted-data');
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
        <ResponsiveContainer width="100%" height={380}>
            <ScatterChart>
                <Scatter name="Tidal Level" dataKey="level" data={realtimeData} fill="#6c5cdd" shape={<CustomMarker size={3} fill={"#6c5cdd"} />} />
                <Scatter name="Current Level" dataKey="level" data={[realtimeData[realtimeData.length - 1]]} stroke="#6c5cdd" fill="red" strokeWidth={5} shape={<CustomMarkerLast size={8} />} />
                <Scatter name="Predicted Data" dataKey="level" data={predictedData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="timestamp" domain={['dataMin', 'dataMax']} type="number" tickFormatter={tickFormatter} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default RealtimeLineChart;