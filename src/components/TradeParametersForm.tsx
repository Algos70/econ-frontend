import { useState } from 'react';

export interface TradeParameters {
  longterm_sma: number | string;
  shortterm_sma: number | string;
  rsi_period: number | string;
  bb_lenght: number | string;
  rsi_oversold: number | string;
  rsi_overbought: number | string;
}

interface TradeParametersFormProps {
  onSubmit: (parameters: TradeParameters) => void;
}

function TradeParametersForm({ onSubmit }: TradeParametersFormProps) {
  const [parameters, setParameters] = useState<TradeParameters>({
    longterm_sma: 20,
    shortterm_sma: 8,
    rsi_period: 8,
    bb_lenght: 20,
    rsi_oversold: 30,
    rsi_overbought: 70,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/^0+(?=\d)/, '');
    
    // Keep the empty string in local state
    setParameters(prev => ({
      ...prev,
      [name]: cleanedValue
    }));

    // Send number to parent (convert empty string to 0)
    onSubmit({
      ...parameters,
      [name]: cleanedValue === '' ? 0 : Number(cleanedValue)
    });
  };

  return (
    <div className="trade-parameters-form">
      <div className="form-group">
        <label>
          Long-term SMA:
          <input
            type="number"
            name="longterm_sma"
            value={parameters.longterm_sma}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Short-term SMA:
          <input
            type="number"
            name="shortterm_sma"
            value={parameters.shortterm_sma}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          RSI Period:
          <input
            type="number"
            name="rsi_period"
            value={parameters.rsi_period}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Bollinger Bands Length:
          <input
            type="number"
            name="bb_lenght"
            value={parameters.bb_lenght}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          RSI Oversold:
          <input
            type="number"
            name="rsi_oversold"
            value={parameters.rsi_oversold}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          RSI Overbought:
          <input
            type="number"
            name="rsi_overbought"
            value={parameters.rsi_overbought}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
}

export default TradeParametersForm; 