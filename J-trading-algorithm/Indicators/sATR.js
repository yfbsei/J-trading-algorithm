import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { round, length } from '../Utilites/utilites.js';
const ATR = require('technicalindicators').ATR;

const sATR = async ( high = [], low = [], close = [], period = 16, scale = 2, varLine = [] ) => { // Scale is number of decimals 
    const defATR = [];
    const ss = [];
  
    const aTR = ATR.calculate({
      high : high,
      low  : low,
      close : close,
      period : period
    });
  
  const nl = aTR.map(x => 5.1 * x); // Multiplier 
  const tempClose = length(close, nl.length);
  const tempVarLine = length(varLine, nl.length);
  
  for (let i = 0; i < tempClose.length; i++) {
    const preDefATR = isNaN(defATR[i-1]) ? 0.00 : defATR[i-1]; 
    const preClose = isNaN(tempClose[i-1]) ? 0.00 : tempClose[i-1];
  
    const x = 
    ( tempClose[i] > preDefATR && preClose > preDefATR ) ? Math.max(preDefATR, tempClose[i] - nl[i]) :
    ( tempClose[i] < preDefATR && preClose < preDefATR ) ? Math.min(preDefATR, tempClose[i] + nl[i]) :
    ( tempClose[i] > preDefATR ) ? tempClose[i] - nl[i] :
    tempClose[i] + nl[i];
  
    defATR.push(x);
    ss.push( defATR[i] > tempVarLine[i] ? defATR[i] - (defATR[i]-tempVarLine[i]) / 2 : defATR[i] + (tempVarLine[i]-defATR[i]) / 2 );
  
  }
    return {
      jsa: defATR.map(x => round(x, scale)),
      jss: ss.map(x => round(x, scale))
    }
  }


  const crossOverUnder = ( ...args ) => {

    const len = args.map(x => x.length).reduce((x,y) => Math.min(x,y));
    const [ tempJVarLine, tempJsa, tempJss, close ] = args.map(x => length(x, len)).map(x => [x[x.length-2], x[x.length-1]]);
  
    const overUnder = 
    (tempJVarLine[0] < tempJsa[0] && tempJVarLine[1] > tempJsa[1]) ? {type: "Long", entry: close[1], maxlev: '10x', tp: round((close[1] - tempJss[1])*1 + close[1]), tp1: round((close[1] - tempJss[1])*2 + close[1]), callBackRate: "1%", trailingSL: round((close[1] - tempJss[1])*0.7 + close[1]), sl: tempJss[1]} : 
    (tempJVarLine[0] > tempJsa[0] && tempJVarLine[1] < tempJsa[1]) ? {type: "Short", entry: close[1], maxlev: '10x', tp: close[1] - round(tempJss[1] - close[1])*1, tp1: close[1] - round(tempJss[1] - close[1])*2, callBackRate: "1%", trailingSL: close[1] - round(tempJss[1] - close[1])*0.7, sl: tempJss[1]} : 
    false;
    
    return overUnder;
  }

export { sATR, crossOverUnder }