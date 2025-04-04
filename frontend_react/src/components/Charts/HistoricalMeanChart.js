import React, { useEffect, useState } from 'react';
import { LineChart, Line, ReferenceLine, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { useConfig } from '../../ConfigContext';
import dayjs from 'dayjs';
import { Button } from '@mui/material';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { level } = payload[0].payload; // Access the level value

        // const dateTime = new Date(timestamp);
        // const formattedDate = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        // const formattedTime = dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (typeof level === 'number' && !isNaN(level)) {
            return (
                <div 
                className="custom-tooltip"
                style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    color: 'white', 
                    padding: '8px', 
                    borderRadius: '4px',
                    fontSize: "14px",
                    }}
                >
                    <p style={{ margin: 0 }}>{`Mean Level: ${level.toFixed(2)} m`}</p>
                </div>
            );
        }
        return null;
    }
    return null;
};

const HistoricalMeanChart = () => {
    const { config } = useConfig();
    const dataServeUrl = process.env.REACT_APP_DATA_SERVE_ENDPOINT;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const [state, setState] = useState(initialState);
    // const { left, right, refAreaLeft, refAreaRight, top, bottom } = state;
    
    const [zoomState, setZoomState] = useState({
        left: "dataMin",
        right: "dataMax",
        refAreaLeft: "",
        refAreaRight: "",
        top: "dataMax+1",
        bottom: "dataMin-1",
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${dataServeUrl}/api/analytics/historical-data/monthly-means`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                // timestamps->numerical values
                const transformedData = result.map(d => ({
                    ...d,
                    timestamp: dayjs(d.timestamp, "YYYY-MM").valueOf(), // Convert "1950-01" to timestamp
                }));
    
                setData(transformedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataServeUrl]);

    const getAxisYDomain = (from, to, data, ref, offset) => {
        const refData = data.filter((d) => d.timestamp >= from && d.timestamp <= to);
        if (refData.length === 0) return [0, 4];
        let [bottom, top] = [refData[0]?.[ref] ?? 0, refData[0]?.[ref] ?? 0];
      
        refData.forEach((d) => {
          if (d[ref] > top) top = d[ref];
          if (d[ref] < bottom) bottom = d[ref];
        });
      
        return [(bottom | 0) - offset, (top | 0) + offset];
      };

    // console.log("Sample data:", data[0]);

    const zoom = () => {
        if (zoomState.refAreaLeft === zoomState.refAreaRight || zoomState.refAreaRight === "") {
          setZoomState((prev) => ({ ...prev, refAreaLeft: "", refAreaRight: "" }));
          return;
        }
      
        let [start, end] = [zoomState.refAreaLeft, zoomState.refAreaRight];
        if (start > end) [start, end] = [end, start];
      
        const [newBottom, newTop] = getAxisYDomain(start, end, data, "level", 1);
      
        setZoomState((prev) => ({
          left: start,
          right: end,
          top: newTop,
          bottom: newBottom,
          refAreaLeft: "",
          refAreaRight: "",
        }));
      };

      const zoomOut = () => {
        setZoomState({
          left: "dataMin",
          right: "dataMax",
          refAreaLeft: "",
          refAreaRight: "",
          top: "dataMax+1",
          bottom: "dataMin-1",
        });
      };
      

    if (loading) return <p className='text-black'>Loading...</p>;
    if (error) return <p className='text-black'>Error: {error}</p>;
    const ticks = [-2, -1, 0, 1, 2, 3, 4];

    // console.log(data.map(d => d.timestamp));

    return ( 
        <div style={{ userSelect: "none", display: 'flex', flexDirection: 'column' }}>
            <Button
                style={{
                textTransform: 'none',
                backgroundColor: "#0081A7",
                color: "white",
                border: "none",
                padding: "5px 8px",
                cursor: "pointer",
                marginBottom: '5px',
                maxWidth: '100px'
                }}
                onClick={zoomOut}
            >
                Zoom Out
            </Button>

            <ResponsiveContainer width="100%" height={290}>
             {/* <ErrorBoundary> */}
                <LineChart 
                    // key={`${left}-${right}`}
                    width="100%" 
                    height="100%" 
                    data={data}
                    onMouseDown={(e) => setZoomState(prev => ({ ...prev, refAreaLeft: e?.activeLabel }))}
                    onMouseMove={(e) => zoomState.refAreaLeft && setZoomState(prev => ({ ...prev, refAreaRight: e?.activeLabel }))}
                    onMouseUp={zoom}
                >  
                    <Line 
                        type="monotone" 
                        dataKey="level" 
                        stroke="#0081A7" 
                        dot={{strokeWidth: 0.5, r: 2, fill: '#54F2F2'}}
                    />            
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis 
                    allowDataOverflow
                    dataKey="timestamp"
                    type="number" 
                    domain={[zoomState.left, zoomState.right]}
                    tickFormatter={(tick) => dayjs(tick).format('YYYY')}
                    tickLine={false}
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    // axisLine={false}
                    // interval={50}
                    /> 
                    <YAxis 
                    allowDataOverflow
                    domain={[zoomState.bottom, zoomState.top]} 
                    ticks={ticks} 
                    tick={{ fill: '#5E6664', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                            value: 'Meters (m)', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#5E6664', fontSize: 12 }
                        }}
                    />
                    {ticks.map(tick => (
                        <ReferenceLine key={tick} y={tick} stroke="#5E6664"  strokeOpacity="50%" strokeDasharray="5 5" />
                    ))}
                    <Tooltip content={<CustomTooltip />} />

                    {zoomState.refAreaLeft && zoomState.refAreaRight ? (
                        <ReferenceArea
                            x1={zoomState.refAreaLeft}
                            x2={zoomState.refAreaRight}
                            strokeOpacity={0.3}
                            fill="rgba(0, 129, 167, 0.2)"
                        />
                        ) : null}
                </LineChart>
            {/* </ErrorBoundary> */}
        </ResponsiveContainer>
    </div>
    );
};

export default HistoricalMeanChart;