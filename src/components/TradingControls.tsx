import TradeParametersForm from './TradeParametersForm'
import { TradeParameters } from './TradeParametersForm'

interface TradingControlsProps {
  isTrading: boolean;
  showBacktest: boolean;
  isBacktesting: boolean;
  setTradeParameters: (params: TradeParameters) => void;
  startTrading: () => void;
  updateTrading: () => void;
  stopTrading: () => void;
  runAllBacktests: () => void;
}

function TradingControls({
  isTrading,
  showBacktest,
  isBacktesting,
  setTradeParameters,
  startTrading,
  updateTrading,
  stopTrading,
  runAllBacktests
}: TradingControlsProps) {
  return (
    <div className="trading-controls">
      <TradeParametersForm onSubmit={setTradeParameters} />
      {!showBacktest ? (
        <div className="controls">
          {!isTrading ? (
            <button onClick={startTrading}>Start Trading</button>
          ) : (
            <button onClick={updateTrading}>Update Trading</button>
          )}
          <button onClick={stopTrading}>Stop Trading</button>
        </div>
      ) : (
        <div className="controls">
          <button onClick={runAllBacktests} disabled={isBacktesting}>
            {isBacktesting ? 'Running Backtests...' : 'Run All Backtests'}
          </button>
        </div>
      )}
    </div>
  )
}

export default TradingControls 