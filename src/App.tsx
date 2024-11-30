import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import TradingPanel from './components/TradingPanel'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
      
      if (data.errors) {
        toast.error(`Trading errors: ${data.errors}`);
      } else if (data.started_pairs && data.started_pairs.length > 0) {
        toast.success(`Trading started for: ${data.started_pairs.join(', ')}`);
      } else {
        toast.error('No pairs were started');
      }
      
      console.log('Trading response:', data);
    } catch (error) {
      toast.error(`Error starting trading: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      
      if (data.errors) {
        toast.error(`Trading errors: ${data.errors}`);
      } else if (data.stopped_pairs && data.stopped_pairs.length > 0) {
        toast.success(`Trading stopped for: ${data.stopped_pairs.join(', ')}`);
      } else {
        toast.error('No pairs were stopped');
      }
      
      console.log('Trading response:', data);
    } catch (error) {
      toast.error(`Error stopping trading: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error stopping trading:', error);
    }
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
      <div className="header">
        <h1>Crypto Trading Dashboard</h1>
        <div className="controls">
          <button onClick={startTrading}>Start Trading</button>
          <button onClick={stopTrading}>Stop Trading</button>
        </div>
      </div>
      <div className="panels-grid">
        {SYMBOLS.map((symbol) => (
          <div key={symbol}>
            {socket && <TradingPanel socket={socket} symbol={symbol} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
