import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoPrices = () => {
    const [prices, setPrices] = useState({});

    const fetchCryptoPrices = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd');
            setPrices(response.data);
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    };

    useEffect(() => {
        fetchCryptoPrices();
    }, []);

    return (
        <div>
            <h2>Crypto Prices</h2>
            <p>Bitcoin: ${prices.bitcoin?.usd}</p>
            <p>Ethereum: ${prices.ethereum?.usd}</p>
            <p>Litecoin: ${prices.litecoin?.usd}</p>
        </div>
    );
};

export default CryptoPrices;
