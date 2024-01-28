import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { round, length } from '../Utilites/utilites.js';
const SMA = require('technicalindicators').SMA;

const varLine = async ( close = [], open = [], high = [], low = [], fastLen = 6, scale = 2 ) => { // Scale is number of decimals 
    const varLine = [];
  
    const 
    cc = SMA.calculate({period : fastLen, values : close }),
    oo = SMA.calculate({period : fastLen, values : open }),
    hh = SMA.calculate({period : fastLen, values : high }),
    ll = SMA.calculate({period : fastLen, values : low });
  
    const tempClose = length(close, cc.length);
  
    for (let i = 0; i < tempClose.length; i++) {
      const lv = Math.abs( (cc[i]-oo[i])/(hh[i] - ll[i]) );
      const preVarLine = isNaN(varLine[i-1]) ? 0.00 : varLine[i-1]; 
      varLine.push( round(lv*tempClose[i]+(1-lv) * preVarLine, scale) );
    }
    return varLine;
  }


export default varLine;