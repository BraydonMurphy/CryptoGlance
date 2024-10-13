import React, { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../App.css';

function CryptoGlance() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [livePrice, setLivePrice] = useState(null);
  const [fiatAmount, setFiatAmount] = useState('');
  const [cryptoEquivalent, setCryptoEquivalent] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Price History',
        data: [],
        fill: true,
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderColor: '#FFA500',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  });

  // Memoized function to fetch live price data
  const fetchLivePrice = useCallback(async () => {
    try {
      console.log('Fetching live price...');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${selectedCurrency}`
      );
      if (!response.ok) throw new Error('Failed to fetch price');
      const data = await response.json();
      setLivePrice(data[selectedCrypto][selectedCurrency]);
    } catch (error) {
      console.error('Error fetching live price:', error);
      setLivePrice(null); // Set to null in case of an error
    }
  }, [selectedCrypto, selectedCurrency]);

  // useEffect to fetch live price initially and set up interval for updates
  useEffect(() => {
    fetchLivePrice(); // Initial fetch

    const interval = setInterval(() => {
      fetchLivePrice(); // Fetch every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [fetchLivePrice]);

  // Memoized function to fetch price history data
  const fetchPriceHistory = useCallback(async () => {
    try {
      console.log('Fetching price history...');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=${selectedCurrency}&days=1`
      );
      if (!response.ok) throw new Error('Failed to fetch price history');
      const result = await response.json();
      const labels = result.prices.map((price) =>
        new Date(price[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const data = result.prices.map((price) => price[1]);

      setChartData((prevChartData) => ({
        ...prevChartData,
        labels: labels,
        datasets: [
          {
            ...prevChartData.datasets[0],
            label: `${selectedCrypto.toUpperCase()} Price (${selectedCurrency.toUpperCase()})`,
            data: data,
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching price history:', error);
      setChartData((prevChartData) => ({
        ...prevChartData,
        labels: [],
        datasets: [{ ...prevChartData.datasets[0], data: [] }],
      })); // Clear chart in case of error
    }
  }, [selectedCrypto, selectedCurrency]);

  // useEffect to fetch price history when selectedCrypto or selectedCurrency changes
  useEffect(() => {
    fetchPriceHistory();
  }, [fetchPriceHistory]);

  const options = {
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return `Price: ${tooltipItem.raw.toFixed(2)} ${selectedCurrency.toUpperCase()}`;
          },
          title: function (tooltipItems) {
            return `Time: ${tooltipItems[0].label}`;
          },
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Handlers for the number pad
  const handleNumberClick = (number) => {
    setFiatAmount((prev) => prev + number.toString());
  };

  const handleDecimalClick = () => {
    if (!fiatAmount.includes('.')) {
      setFiatAmount((prev) => prev + '.');
    }
  };

  const handleClearClick = () => {
    setFiatAmount('');
    setCryptoEquivalent(0);
  };

  const handleBackspaceClick = () => {
    setFiatAmount((prev) => prev.slice(0, -1));
  };

  const handleEnterClick = () => {
    if (fiatAmount !== '' && livePrice) {
      setCryptoEquivalent((fiatAmount / livePrice).toFixed(6));
    } else {
      setCryptoEquivalent(0);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CryptoGlance</h1>
        <div className="live-update">
          <h2>Live Price: {livePrice ? `${livePrice.toFixed(2)} ${selectedCurrency.toUpperCase()}` : 'Loading...'}</h2>
        </div>

        {/* Currency and Cryptocurrency Selectors */}
        <div className="selectors" style={{ margin: '20px 0' }}>
          <label style={{ marginRight: '10px' }}>
            Cryptocurrency:
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px' }}
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="litecoin">Litecoin</option>
              <option value="solana">solana</option> {/* Corrected value to match CoinGecko ID */}
              <option value="polkadot">polkadot</option> {/* Corrected value to match CoinGecko ID */}
            </select>
          </label>
          <label style={{ marginLeft: '20px' }}>
            Currency:
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px' }}
            >
              <option value="usd">USD</option>
              <option value="cad">CAD</option>
              <option value="eur">EUR</option>
              <option value="jpy">JPY</option>
            </select>
          </label>
        </div>

        {/* Chart Section */}
        <div className="chart-wrapper" style={{ marginBottom: '20px' }}>
          <Line data={chartData} options={options} />
        </div>

        {/* Dropdown Calculator Section */}
        <details className="calculator-dropdown">
          <summary>Calculator</summary>
          <div className="fiat-input" style={{ marginTop: '10px' }}>
            <h3 style={{ color: '#FFFFFF' }}>
              Equivalent in {selectedCrypto.toUpperCase()}: {cryptoEquivalent ? `${cryptoEquivalent}` : '0.000000'}
            </h3>
          </div>

          {/* Number Pad for entering fiat amount */}
          <div className="number-pad">
            <div className="display" style={{ marginBottom: '10px', color: '#000000', backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '5px' }}>{fiatAmount || '0'}</div>
            <div className="buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button onClick={() => handleNumberClick(1)}>1</button>
              <button onClick={() => handleNumberClick(2)}>2</button>
              <button onClick={() => handleNumberClick(3)}>3</button>
              <button onClick={() => handleNumberClick(4)}>4</button>
              <button onClick={() => handleNumberClick(5)}>5</button>
              <button onClick={() => handleNumberClick(6)}>6</button>
              <button onClick={() => handleNumberClick(7)}>7</button>
              <button onClick={() => handleNumberClick(8)}>8</button>
              <button onClick={() => handleNumberClick(9)}>9</button>
              <button onClick={() => handleNumberClick(0)}>0</button>
              <button onClick={handleDecimalClick}>.</button>
              <button onClick={handleBackspaceClick}>Backspace</button>
              <button onClick={handleClearClick}>Clear</button>
              <button onClick={handleEnterClick} className="enter-btn" style={{ gridColumn: 'span 2' }}>Enter</button>
            </div>
          </div>
        </details>
      </header>
    </div>
  );
}

export default CryptoGlance;
