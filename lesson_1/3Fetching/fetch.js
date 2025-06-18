const url = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';

const fetch = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
}

fetch(url)