import React, { useEffect, useState } from 'react';
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

  // Fetch live price data
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${selectedCurrency}`
    )
      .then((response) => response.json())
      .then((data) => {
        const price = data[selectedCrypto][selectedCurrency];
        setLivePrice(price);
      })
      .catch((error) => console.error('Error fetching live prices:', error));
  }, [selectedCrypto, selectedCurrency]);

  // Fetch price history data
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=${selectedCurrency}&days=1`
    )
      .then((response) => response.json())
      .then((result) => {
        const labels = result.prices.map((price) =>
          new Date(price[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        const data = result.prices.map((price) => price[1]);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${selectedCrypto.toUpperCase()} Price (${selectedCurrency.toUpperCase()})`,
              data: data,
              fill: true,
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              borderColor: '#FFA500',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
          ],
        });
      })
      .catch((error) => console.error('Error fetching price history:', error));
  }, [selectedCrypto, selectedCurrency]);

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
      legend: { display: false }, // Hide the legend
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return `Price: ${tooltipItem.raw.toFixed(2)} ${selectedCurrency.toUpperCase()}`;
          },
          title: function (tooltipItems) {
            return `Time: ${tooltipItems[0].label}`;
          }
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false, // Allows easier hovering and tooltip display
    },
    responsive: true,
    maintainAspectRatio: false,
  };  

  // Handlers for the number pad
  const handleNumberClick = (number) => {
    setFiatAmount((prev) => prev + number.toString()); // Concatenate the clicked number
  };

  const handleDecimalClick = () => {
    if (!fiatAmount.includes('.')) {
      setFiatAmount((prev) => prev + '.'); // Add decimal if not already present
    }
  };

  const handleClearClick = () => {
    setFiatAmount(''); // Clear the input
    setCryptoEquivalent(0); // Reset equivalent value
  };

  const handleBackspaceClick = () => {
    setFiatAmount((prev) => prev.slice(0, -1)); // Remove the last character
  };

  const handleEnterClick = () => {
    // Ensure fiatAmount is a valid number and livePrice exists before performing conversion
    if (fiatAmount !== '' && livePrice) {
      setCryptoEquivalent((fiatAmount / livePrice).toFixed(6)); // Update cryptoEquivalent
    } else {
      setCryptoEquivalent(0); // Default to zero if no valid input
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CryptoGlance</h1>
        <div className="dropdowns">
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="litecoin">Litecoin</option>
            {/* Add more crypto options here */}
          </select>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="usd">USD</option>
            <option value="cad">CAD</option>
            <option value="jpy">JPY</option>
            <option value="eur">EUR</option>
            {/* Add more currency options here */}
          </select>
        </div>

        <div className="live-update">
          <h2>Live Price: {livePrice ? `${livePrice.toFixed(2)} ${selectedCurrency.toUpperCase()}` : 'Loading...'}</h2>
        </div>

        <div className="fiat-input">
          <h3>
            Equivalent in {selectedCrypto.toUpperCase()}: {cryptoEquivalent ? `${cryptoEquivalent}` : '0.000000'}
          </h3>
        </div>

        {/* Number Pad for entering fiat amount */}
        <div className="number-pad">
          <div className="display">{fiatAmount || '0'}</div>
          <div className="buttons">
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
            <button onClick={handleEnterClick} className="enter-btn">Enter</button>
          </div>
        </div>

        <div className="chart-wrapper">
          <Line data={chartData} options={options} />
        </div>
      </header>
    </div>
  );
}

export default CryptoGlance;
