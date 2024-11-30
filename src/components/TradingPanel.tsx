import CandlestickChart from './CandlestickChart';
import SignalConsole from './SignalConsole';
import './TradingPanel.css';

interface Props {
  socket: any;
  symbol: string;
}

const TradingPanel = ({ socket, symbol }: Props) => {
  return (
    <div className="trading-panel">
      <h2>{symbol}</h2>
      <div className="panel-content">
        <div className="chart-section">
          <CandlestickChart socket={socket} symbol={symbol} />
        </div>
        <div className="console-section">
          <SignalConsole socket={socket} symbol={symbol} />
        </div>
      </div>
    </div>
  );
};

export default TradingPanel; 