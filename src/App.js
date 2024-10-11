import React from 'react'; // Keep this line
import './App.css'; // Keep this line
import CryptoPrices from './components/CryptoPrices'; // Keep this line for modular crypto prices component

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to CryptoGlance</h1>
                <CryptoPrices /> {/* This renders the crypto prices component */}
                {/* Placeholder for the future price history chart */}
                <div className="price-chart-placeholder">
                    Price History Chart Coming Soon
                </div>
            </header>
        </div>
    );
}

export default App;
