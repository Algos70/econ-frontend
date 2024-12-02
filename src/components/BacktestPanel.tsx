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
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
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
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d, yyyy'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `${symbol} - ${timeframe}`,
        font: {
          size: 20,
          weight: 'bold' as const
        },
        padding: 20
      },
      legend: {
        labels: {
          font: {
            size: 14
          },
          padding: 15
        },
        position: 'top' as const
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    interaction: {
      mode: 'x' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        hitRadius: 10,
        hoverRadius: 15
      },
      line: {
        tension: 0.1
      }
    },
    animation: {
      duration: 1000
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
              <p>Total Trades: {results[timeframe].signals.length}</p>
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