const round = (n = 0.00, p = 2) => parseFloat(Number(Math.round(n + `e${p}`) + `e-${p}`).toFixed(p));

const length = (arr = [], len = 200) => [...arr].reverse().filter((x,i,a) => a.length = len).reverse(); // Max Candles

const candlestick = async (symbol = "BTCUSDT", interval = "1m", limit = 500) => {
    let response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit + 1}`);
    let data = await response.json();

      //Open High Low close
    const candle = data.map(x => [x[1], x[2], x[3], x[4]]).map(x => x.map(y => Number(y)) );
    candle.pop();


    return {
      open: candle.map(o => o[0]),
      high: candle.map(h => h[1]),
      low: candle.map(l => l[2]),
      close: candle.map(c => c[3]),
    }
}

export { candlestick, round, length };