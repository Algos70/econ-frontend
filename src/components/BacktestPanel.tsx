import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface BacktestPanelProps {
  symbol: string;
  results: any;
}

export default function BacktestPanel({ symbol, results }: BacktestPanelProps) {
  const timeframes = ['15m', '1h', '4h', '1d'];

  const prepareChartData = (timeframe: string) => {
    if (!results || !results[timeframe]) return null;

    const df = results[timeframe].df;
    const signals = results[timeframe].signals;

    const buySignals = signals.filter((s: any) => s.type === 'BUY').map((s: any) => ({
      x: new Date(s.date),
      y: s.price
    }));

    const sellSignals = signals.filter((s: any) => s.type === 'SELL' || s.type === 'STOP_LOSS').map((s: any) => ({
      x: new Date(s.date),
      y: s.price
    }));

    return {
      labels: df.map((row: any) => new Date(row.Date)),
      datasets: [
        {
          label: 'Price',
          data: df.map((row: any) => ({ x: new Date(row.Date), y: row.Close })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          pointRadius: 0
        },
        {
          label: 'Buy Signals',
          data: buySignals,
          backgroundColor: 'green',
          pointRadius: 5,
          pointStyle: 'triangle',
          showLine: false
        },
        {
          label: 'Sell Signals',
          data: sellSignals,
          backgroundColor: 'red',
          pointRadius: 5,
          pointStyle: 'triangle',
          showLine: false
        }
      ]
    };
  };

  const chartOptions = (timeframe: string) => ({
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `${symbol} - ${timeframe}`
      }
    }
  });

  return (
    <div className="backtest-panel">
      <h2>{symbol}</h2>
      <div className="timeframes-grid">
        {timeframes.map(timeframe => (
          <div key={timeframe} className="timeframe-chart">
            <div className="backtest-stats">
              <p>Initial: ${results[timeframe].initial_amount}</p>
              <p>Final: ${results[timeframe].money.toFixed(2)}</p>
              <p>Profit: ${results[timeframe].profit.toFixed(2)}</p>
            </div>
            <div className="backtest-chart">
              {prepareChartData(timeframe) && (
                <Line data={prepareChartData(timeframe)!} options={chartOptions(timeframe)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 