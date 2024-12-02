# Econ Trade Bot Frontend

The React-based frontend interface for the Econ Trade Bot project, providing real-time trading visualization, backtesting analysis, and trading parameter controls.

## Features

- Real-time trading visualization for multiple cryptocurrency pairs (ETH, BTC, AVAX, SOL, RENDER, FET)
- Live candlestick charts with WebSocket integration
- Trading signals console with real-time updates
- Comprehensive backtesting interface with multiple timeframes (15m, 1h, 4h, 1d)
- Interactive trading parameter controls
- Performance tracking and profit/loss monitoring

## Technical Stack

- React + TypeScript
- Vite for build tooling
- Socket.IO for real-time data
- Lightweight Charts for candlestick visualization
- Chart.js for backtesting results
- React-Toastify for notifications

## Installation

1. Clone the repository:

```bash
git clone git@github.com:Algos70/econ-trade-bot.git
cd econ-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Usage

Ensure the backend server is running at `http://127.0.0.1:5000` before starting the frontend.

### Trading Parameters

You can adjust the following strategy parameters in real-time:
- Long-term SMA period (default: 20)
- Short-term SMA period (default: 8)
- RSI period (default: 8)
- Bollinger Bands length (default: 20)
- RSI oversold threshold (default: 30)
- RSI overbought threshold (default: 70)

### Available Views

1. Live Trading View:
   - Real-time candlestick charts
   - Trading signals console
   - Current position and performance metrics

2. Backtesting View:
   - Historical performance analysis
   - Multiple timeframe testing
   - Trade signal visualization
   - Profit/loss metrics

## Development

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## Integration

This frontend interfaces with the Econ Trade Bot backend through:
- REST API endpoints for trading controls and backtesting
- WebSocket connections for real-time price and trading data

## Disclaimer

This application is part of an educational project for Engineering Economics class. Cryptocurrency trading carries significant risks. Use at your own discretion.
