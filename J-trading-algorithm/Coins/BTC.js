import { WebSocket } from 'ws';

import { candlestick, round, length } from '../Utilites/utilites.js';

import varLine from '../Indicators/varLine.js';
import { sATR, crossOverUnder } from '../Indicators/sATR.js';
//-----------------------

const { open, high, low, close } = await candlestick("BTCUSDT", "1m", 500); // Get intial candles default 500

const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m'); // Listen for new candles

socket.on('message', async ( event ) => {
        const { k } = JSON.parse(event.toString());

    if (k.x === true && k.s === "BTCUSDT" && k.i === "1m") { // Signal for 3min BTCUSDT
        open.shift(), high.shift(), low.shift(), close.shift();
        open.push(round(k.o)), high.push(round(k.h)), low.push(round(k.l)), close.push(round(k.c));

        const jvarline = await varLine( close, open, high, low, 6, 2 );
        const { jsa, jss } = await sATR( high, low, close, 16, 2, jvarline );

        const signal = crossOverUnder( jvarline, jsa, jss, close );
         if(signal) {
             console.log(signal)
         }      
        return signal;
    }

})