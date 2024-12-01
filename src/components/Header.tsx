import { TradeParameters } from './TradeParametersForm'
import TradeParametersForm from './TradeParametersForm'

interface HeaderProps {
  showBacktest: boolean;
  setShowBacktest: (show: boolean) => void;
}

function Header({ showBacktest, setShowBacktest }: HeaderProps) {
  return (
    <header className="fixed-header">
      <div className="header-content">
        <div className="header-top">
          <div className="header-section">
            <span className="logo-text">Trading Bot</span>
          </div>
          <div className="header-section">
            <div className="view-controls">
              <button onClick={() => setShowBacktest(false)}>Live Trading</button>
              <button onClick={() => setShowBacktest(true)}>Backtest</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 