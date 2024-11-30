import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import CandlestickChart from './components/CandlestickChart'
import './App.css'

const SYMBOLS = ['ETHUSDT', 'BTCUSDT', 'AVAXUSDT', 'SOLUSDT', 'RENDERUSDT', 'FETUSDT']
const API_URL = 'http://127.0.0.1:5000'

function App() {
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    const newSocket = io(API_URL)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const startTrading = async () => {
    try {
      const tradeParameters = {
        longterm_sma: 20,
        shortterm_sma: 8,
        rsi_period: 8,
        bb_lenght: 20,
        rsi_oversold: 30,
        rsi_overbought: 70
      };

      const response = await fetch(`${API_URL}/api/start-trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeParameters)
      });
      
      const data = await response.json();
      console.log('Trading started:', data);
    } catch (error) {
      console.error('Error starting trading:', error);
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
      console.log('Trading stopped:', data);
    } catch (error) {
      console.error('Error stopping trading:', error);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Crypto Trading Dashboard</h1>
        <div className="controls">
          <button onClick={startTrading}>Start Trading</button>
          <button onClick={stopTrading}>Stop Trading</button>
        </div>
      </div>
      <div className="charts-grid">
        {SYMBOLS.map((symbol) => (
          <div key={symbol} className="chart-container">
            <h2>{symbol}</h2>
            {socket && <CandlestickChart socket={socket} symbol={symbol} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
