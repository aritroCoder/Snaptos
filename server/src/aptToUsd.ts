/* eslint-disable */


export async function convertAptToUsd() {
    const response1 = await fetch('https://www.binance.com/api/v3/ticker/price?symbol=APTUSDT')
    const data1 = await response1.json();
    const price1 = parseFloat(data1.price); 
    console.log(price1)

    const response2 = await fetch('https://api-pub.bitfinex.com/v2/tickers?symbols=tAPTUSD')
    const data2 = await response2.json();
    const price2 = (data2[0][1] + data2[0][3] + data2[0][7])/3;
    console.log(price2)

    const response3 = await fetch('https://api.coinbase.com/v2/prices/APT-USD/spot');
    const data3 = await response3.json();
    const price3 = parseFloat(data3.data.amount);
    console.log(price3);

    const response4 = await fetch('https://api.huobi.pro/market/detail/merged?symbol=aptusdt');
    const data4 = await response4.json();
    const price4 = (data4.tick.bid[0] + data4.tick.ask[0])/2;
    console.log(price4);

    const response5 = await fetch('https://www.mexc.com/open/api/v2/market/ticker?symbol=APT_USDT');
    const data5 = await response5.json();
    const price5 = (parseFloat(data5.data[0].ask) + parseFloat(data5.data[0].bid) + parseFloat(data5.data[0].last))/3;
    console.log(price5)

    return (price1 + price2 + price3 + price4 + price5)/5;

}