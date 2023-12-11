// Chart.js
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export const Chart = ({ data }) => {

  const xAxisData = Array.from({ length: 16 }, (_, index) => index + 1);

  const yAxisData = data.map((entry) => entry.usdValue);

  return (
    <LineChart
      xAxis={[{ data: xAxisData }]}
      series={[{ data: yAxisData }]}
      width={500}
      height={300}
    />
  );
};