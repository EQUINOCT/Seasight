// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { useConfig } from '../../ConfigContext';
// // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 700, pv: 2400, amt: 2400}, {name: 'Page C', uv: 100, pv: 2400, amt: 2400}, ];

// const { config } = useConfig();
// const dataServeUrl = config[process.env.ENVIRONMENT].DATA_SERVE_ENDPOINT;

// const data = await fetch(`${dataServeUrl}/api/analytics/historical-data`)
//       .then(response => response.json());

// // const projected_data = await fetch('http://localhost:8000/api/analytics/projected_data')
// //       .then(response => response.json());

// // console.log(realtime_data);

// const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const { level } = payload[0].payload; // Access the level value
//         return (
//             <div className="custom-tooltip">
//                 <p>{`Mean Level: ${level.toFixed(2)} m`}</p>
//             </div>
//         );
//     }
//     return null;
// };

// const renderHistoricalMeanChart = (
//   <ResponsiveContainer width="100%" height={400}>
//     <LineChart width="100%" height="100%" data={data}>
//       <Line type="monotone" dataKey="level" stroke="#8884d8" />
//       <CartesianGrid stroke="#ccc" />
//       <XAxis dataKey="timestamp" />
//       <YAxis domain={[0.5, 1.5]}/>
//       <Tooltip content={<CustomTooltip />} />
//     </LineChart>
//   </ResponsiveContainer>
// );

// export default renderHistoricalMeanChart;

import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useConfig } from '../../ConfigContext';
import dayjs, { Dayjs } from 'dayjs';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { level } = payload[0].payload; // Access the level value
        return (
            <div className="custom-tooltip">
                <p>{`Mean Level: ${level.toFixed(2)} m`}</p>
            </div>
        );
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
                const response = await fetch(`${dataServeUrl}/api/analytics/historical-data`);
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
        <ResponsiveContainer width="100%" height={310}>
            <LineChart width="100%" height="100%" data={data}>
                <Line type="monotone" dataKey="level" stroke="#8884d8" />
                <Line type="monotone" dataKey="level" stroke="#8884d8" />
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
                tick={{ fill: '#E4F7F2', fontSize: 12 }}
                // axisLine={false}
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
                        style: { textAnchor: 'middle', fill: '#E4F7F2', fontSize: 12 }
                    }}
                />
                {ticks.map(tick => (
                    <ReferenceLine key={tick} y={tick} stroke="#E4F7F2"  strokeOpacity="50%" strokeDasharray="5 5" />
                ))}
                <Tooltip content={<CustomTooltip />} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HistoricalMeanChart;