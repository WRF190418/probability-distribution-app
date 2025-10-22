import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DistributionDataPoint } from '../../types';

interface DistributionChartProps {
  data: DistributionDataPoint[];
  isDiscrete?: boolean;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, isDiscrete = false }) => {
  if (isDiscrete) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tickFormatter={(value) => value.toString()} />
          <YAxis />
          <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(6) : String(value)} />
          <Bar dataKey="y" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(6) : String(value)} />
        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DistributionChart;