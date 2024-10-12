import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';  // Automatically includes the necessary elements

const data = {
  labels: ['01:45 AM', '02:45 AM', '03:45 AM', ...], // Replace with your time data
  datasets: [
    {
      label: 'Price',
      data: [83500, 84500, 86000, ...],  // Replace with your price data
      borderColor: '#FF9900',  // Thicker orange line
      backgroundColor: 'rgba(255, 153, 0, 0.1)',  // Subtle fill under the line
      borderWidth: 3,  // Make the line thicker
      pointRadius: 2,  // Small points on data
      pointBackgroundColor: '#ffffff',  // White dots at data points
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Hide legend if not needed
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Darker tooltips for better visibility
      titleColor: '#fff',
      bodyColor: '#fff',
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',  // Light text for ticks
        font: {
          size: 14,  // Increase font size for readability
        },
      },
      grid: {
        display: false,  // Hide grid lines on x-axis
      },
    },
    y: {
      ticks: {
        color: '#ffffff',  // Light text for ticks
        font: {
          size: 14,  // Increase font size for readability
        },
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',  // Light grid lines
      },
    },
  },
};

function PriceHistoryChart() {
  return <Line data={data} options={options} />;
}

export default PriceHistoryChart;
