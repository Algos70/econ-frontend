import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import TradingPanel from './components/TradingPanel'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import TradeParametersForm, { TradeParameters } from './components/TradeParametersForm'
import BacktestPanel from './components/BacktestPanel'
import Header from './components/Header'
import TradingControls from './components/TradingControls'

const SYMBOLS = ['ETHUSDT', 'BTCUSDT', 'AVAXUSDT', 'SOLUSDT', 'RENDERUSDT', 'FETUSDT']
const API_URL = 'http://127.0.0.1:5000'

function App() {
  const [socket, setSocket] = useState<any>(null)
  const [tradeParameters, setTradeParameters] = useState<TradeParameters>({
    longterm_sma: 20,
    shortterm_sma: 8,
    rsi_period: 8,
    bb_lenght: 20,
    rsi_oversold: 30,
    rsi_overbought: 70
  });
  const [isTrading, setIsTrading] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [backtestResults, setBacktestResults] = useState<{[key: string]: any}>({});
  const [isBacktesting, setIsBacktesting] = useState(false);

  useEffect(() => {
    const newSocket = io(API_URL)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const startTrading = async () => {
    try {
      const response = await fetch(`${API_URL}/api/start-trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeParameters)
      });
      
      const data = await response.json();
      
      if (data.errors) {
        toast.error(`Trading errors: ${data.errors}`);
      } else if (data.started_pairs && data.started_pairs.length > 0) {
        toast.success(`Trading started for: ${data.started_pairs.join(', ')}`);
        setIsTrading(true);
      } else {
        toast.error('No pairs were started');
      }
      
    } catch (error) {
      toast.error(`Error starting trading: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error starting trading:', error);
    }
  };

  const updateTrading = async () => {
    try {
      const response = await fetch(`${API_URL}/api/update-trade-parameters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parameters: tradeParameters })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        toast.error(`Update errors: ${data.errors}`);
      } else {
        toast.success('Trading parameters updated successfully');
      }
      
    } catch (error) {
      toast.error(`Error updating parameters: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error updating parameters:', error);
    }
  };

  const stopTrading = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stop-trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (data.errors) {
        toast.error(`Trading errors: ${data.errors}`);
      } else if (data.stopped_pairs && data.stopped_pairs.length > 0) {
        toast.success(`Trading stopped for: ${data.stopped_pairs.join(', ')}`);
        setIsTrading(false);
      } else {
        toast.error('No pairs were stopped');
      }
      
    } catch (error) {
      toast.error(`Error stopping trading: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error stopping trading:', error);
    }
  };

  const runAllBacktests = async () => {
    setIsBacktesting(true);
    const results: {[key: string]: any} = {};
    
    try {
      toast.info('Starting backtests for all symbols...', {
        position: "top-right",
        autoClose: 2000
      });

      await Promise.all(SYMBOLS.map(async (symbol) => {
        const response = await fetch('http://127.0.0.1:5000/api/backtest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol,
            parameters: tradeParameters
          })
        });
        
        const data = await response.json();
        
        if (data.status === 'error') {
          toast.error(`Error in ${symbol} backtest: ${data.message}`);
          return;
        }
        
        results[symbol] = data.results;
        toast.success(`Backtest completed for ${symbol}`);
      }));
      
      setBacktestResults(results);
      toast.success('All backtests completed successfully!', {
        position: "top-right",
        autoClose: 5000
      });
      
    } catch (error) {
      toast.error(`Error running backtests: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error running backtests:', error);
    }
    
    setIsBacktesting(false);
  };

  return (
    <div className="app">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Header
        showBacktest={showBacktest}
        setShowBacktest={setShowBacktest}
      />
      <main className="main-content">
        <TradingControls
          isTrading={isTrading}
          showBacktest={showBacktest}
          isBacktesting={isBacktesting}
          setTradeParameters={setTradeParameters}
          startTrading={startTrading}
          updateTrading={updateTrading}
          stopTrading={stopTrading}
          runAllBacktests={runAllBacktests}
        />
        {showBacktest ? (
          <div className="panels-grid">
            {Object.keys(backtestResults).map((symbol) => (
              <div key={symbol}>
                <BacktestPanel symbol={symbol} results={backtestResults[symbol]} />
              </div>
            ))}
          </div>
        ) : (
          <div className="panels-grid">
            {SYMBOLS.map((symbol) => (
              <div key={symbol}>
                {socket && <TradingPanel socket={socket} symbol={symbol} />}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
