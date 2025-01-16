import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 700, pv: 2400, amt: 2400}, {name: 'Page C', uv: 100, pv: 2400, amt: 2400}, ];


const data = await fetch('http://localhost:8000/api/analytics/historical-data')
      .then(response => response.json());

// const projected_data = await fetch('http://localhost:8000/api/analytics/projected_data')
//       .then(response => response.json());

// console.log(realtime_data);

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

const renderHistoricalMeanChart = (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart width="100%" height="100%" data={data}>
      <Line type="monotone" dataKey="level" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="timestamp" />
      <YAxis domain={[0.5, 1.5]}/>
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  </ResponsiveContainer>
);

export default renderHistoricalMeanChart;