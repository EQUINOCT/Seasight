import { format } from 'maplibre-gl';
import { LineChart, Line, Scatter, ScatterChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 700, pv: 2400, amt: 2400}, {name: 'Page C', uv: 100, pv: 2400, amt: 2400}, ];


const realtimeData = await fetch('http://localhost:8000/api/analytics/realtime-data')
      .then(response => response.json());

const predictedData = await fetch('http://localhost:8000/api/analytics/predicted-data')
      .then(response => response.json());

// console.log(predicted_data);

// Function to convert dd-mm-YYYY HH:MM to Unix timestamp in milliseconds

const parseDate = (dateString) => {
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
};

const parseDatePred = (dateString) => {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // month is 0-indexed
};

// Function to format the timestamp for the x-axis
const tickFormatter = (unixTime) => {

      return new Date(unixTime).toLocaleTimeString(); // You can customize this format
};

const formattedData = realtimeData.map(item => ({
      ...item,
      timestamp: parseDate(item.timestamp),
}));

// const formattedPredData = predictedData.map(item => ({
//       ...item,
//       timestamp: parseDatePred(item.timestamp),
// }));

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

// const CustomTooltipPred = ({ active, payload }) => {
//       if (active && payload && payload.length) {
//             const { level } = payload[0].payload; // Access the level value
//             return (
//                   <div className="custom-tooltip">
//                         <p>{`Projected Level: ${level} m`}</p>
//                   </div>
//             );
//       }
//       return null;
// };
// Custom Marker Component

const CustomMarker = ({ cx, cy, size, fill }) => {
      return (
            <circle cx={cx} cy={cy} r={size} fill={fill} />
      );
};

const CustomMarkerLast = ({ cx, cy, size }) => {
      return (
            <circle cx={cx} cy={cy} r={size} fill="red" stroke="red" strokeWidth={5} />
      );
};

const renderRealtimeLineChart = (
      <ResponsiveContainer width="100%" height={380}>
            <ScatterChart width="100%" height="100%">
                  <Scatter name="Tidal Level" type="monotone" dataKey="level" data={formattedData} fill="#6c5cdd" shape={<CustomMarker size={3} fill={"#6c5cdd"} />} />
                  <Scatter name="Current Level" type="monotone" dataKey="level" data={[formattedData[formattedData.length - 1]]} stroke="#6c5cdd" fill="red" strokeWidth={5} shape={<CustomMarkerLast size={8} />} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis
                        dataKey="timestamp"
                        domain={['dataMin', 'dataMax']}
                        type="number"
                        tickFormatter={tickFormatter} // Format the timestamp
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {/* <Line 
                        type="monotone" 
                        data={formattedPredData} 
                        dataKey="level" 
                        stroke="#ffb201"
                        strokeWidth={2} 
                        dot={true} // Disable dots on the line
                  /> */}
                  {/* <Scatter name="Predicted Data" dataKey="level" data={formattedPredData} fill="#ffb201" shape={<CustomMarker size={6} fill={"#ffb201"} />} /> */}
                  {/* <Line>data={formattedPredData}</Line> */}
            </ScatterChart>

      </ResponsiveContainer>
);

export { renderRealtimeLineChart }