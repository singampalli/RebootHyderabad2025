import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Charts = ({ data,type }) => {
  // Clean & format data: convert timestamp to readable time
  const formattedData = data.map(entry => ({
    ...entry,
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    utilization: entry.value.toFixed(2),
  }));

  return (
    <div style={{ width: '100%', height: 400, padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>CPU Utilization Over Time</h3>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 100]} label={{ value: 'Utilization (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="utilization"
            stroke="#8884d8"
            dot={false}
            name={`${type.toUpperCase()} %`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
