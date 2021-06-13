import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useStoreState } from '../../store/upload';

const options = {
  indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 100,
    },
  },
  responsive: true,
  plugins: {
    legend: false,
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.parsed.x}%`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        callback: (val: number) => {
          return `${val}%`;
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const Chart = () => {
  const emotions = useStoreState((state) => state.results.emotions);
  const data = {
    labels: ['Happy', 'Angry', 'Fear', 'Sad', 'Surprise', 'Disgust', 'Neutral'],
    datasets: [
      {
        label: '',
        data: [
          100 * emotions.happy,
          100 * emotions.angry,
          100 * emotions.fear,
          100 * emotions.sad,
          100 * emotions.surprise,
          100 * emotions.disgust,
          100 * emotions.neutral,
        ],
        backgroundColor: [
          '#4CAF50',
          '#f44336',
          '#FF9800',
          '#2196F3',
          '#FFEB3B',
          '#673AB7',
          '#9E9E9E',
        ],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div style={{ maxWidth: 'calc(100% - 20px)', width: '100%' }}>
      <div className="header">
        <h1 className="title" style={{ textAlign: 'center' }}>
          Results
        </h1>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Chart;
