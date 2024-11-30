import { useEffect, useRef, useState } from 'react';
import './SignalConsole.css';

interface Signal {
  type: 'buy' | 'sell';
  timestamp: string;
  price: number;
  tradeProfit?: number;
  balance: number;
  totalProfit: number;
  tradesMade: number;
}

interface Props {
  socket: any;
  symbol: string;
}

const SignalConsole = ({ socket, symbol }: Props) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBuySignal = (data: any) => {
      if (data.symbol === symbol) {
        const signal: Signal = {
          type: 'buy',
          timestamp: new Date().toLocaleTimeString(),
          price: parseFloat(data.close),
          balance: data.balance,
          totalProfit: data.total_profit,
          tradesMade: data.trades_made
        };
        setSignals(prev => [...prev, signal]);
      }
    };

    const handleSellSignal = (data: any) => {
      if (data.symbol === symbol) {
        const signal: Signal = {
          type: 'sell',
          timestamp: new Date().toLocaleTimeString(),
          price: parseFloat(data.close),
          tradeProfit: data.trade_profit,
          balance: data.balance,
          totalProfit: data.total_profit,
          tradesMade: data.trades_made
        };
        setSignals(prev => [...prev, signal]);
      }
    };

    socket.on('buy_signal', handleBuySignal);
    socket.on('sell_signal', handleSellSignal);

    return () => {
      socket.off('buy_signal', handleBuySignal);
      socket.off('sell_signal', handleSellSignal);
    };
  }, [socket, symbol]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [signals]);

  return (
    <div className="signal-console" ref={consoleRef}>
      {signals.map((signal, index) => (
        <div
          key={index}
          className={`signal-entry ${signal.type === 'buy' ? 'buy' : 'sell'}`}
        >
          <div className="signal-time">{signal.timestamp}</div>
          <div className="signal-type">
            {signal.type === 'buy' ? '🟢 BUY' : '🔴 SELL'}
          </div>
          <div className="signal-price">
            Price: ${signal.price.toFixed(2)}
          </div>
          {signal.type === 'sell' && signal.tradeProfit && (
            <div className={`signal-profit ${signal.tradeProfit >= 0 ? 'profit' : 'loss'}`}>
              Trade P/L: ${signal.tradeProfit.toFixed(2)}
            </div>
          )}
          <div className="signal-balance">
            Balance: ${signal.balance.toFixed(2)}
          </div>
          <div className={`signal-total-profit ${signal.totalProfit >= 0 ? 'profit' : 'loss'}`}>
            Total P/L: ${signal.totalProfit.toFixed(2)}
          </div>
          <div className="signal-trades">
            Total Trades: {signal.tradesMade}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignalConsole; 