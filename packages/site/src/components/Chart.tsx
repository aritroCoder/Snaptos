// Chart.js
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';

export const Chart = ({ data }) => {

    const xAxisData = Object.keys(data).map((key) => parseInt(key.replace('price_', '')));

    const yAxisData = Object.values(data);
  
    return (
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 8, borderColor: 'black', border: 2,  marginTop: '2 rem' }}>
            <p>USD Price Chart of last 16 minutes</p>
        <LineChart
          xAxis={[{ data: xAxisData }]}
          series={[{ data: yAxisData }]}
          width={500}
          height={300}
        />
      </Box>
    );
};