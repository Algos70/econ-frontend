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

interface Signal {
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
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
          pointRadius: 0,
          borderWidth: 1,
          order: 1
        },
        {
          label: 'Buy Signals',
          data: buySignals,
          backgroundColor: 'rgba(0, 255, 0, 0.8)',
          borderColor: 'rgba(0, 255, 0, 1)',
          pointRadius: 12,
          pointStyle: 'triangle',
          rotation: 0,
          borderWidth: 2,
          showLine: false,
          order: 0
        },
        {
          label: 'Sell Signals',
          data: sellSignals,
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          borderColor: 'rgba(255, 0, 0, 1)',
          pointRadius: 12,
          pointStyle: 'triangle',
          rotation: 180,
          borderWidth: 2,
          showLine: false,
          order: 0
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
        text: `${symbol} - ${timeframe}`,
        font: {
          size: 16
        }
      },
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      }
    },
    elements: {
      point: {
        hitRadius: 8,
        hoverRadius: 14
      }
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
            <div className="signals-table-container">
              <h3>{timeframe} Signals</h3>
              <table className="signals-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results[timeframe].signals.map((signal: Signal, index: number) => (
                    <tr key={index} className={`signal-row ${signal.type.toLowerCase()}`}>
                      <td>{formatDate(signal.date)}</td>
                      <td>{signal.type}</td>
                      <td>${signal.price.toFixed(2)}</td>
                      <td>{signal.amount.toFixed(6)}</td>
                      <td>${signal.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 