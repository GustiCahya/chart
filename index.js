//Pseudo code
//Step 1: Define chart properties.
//Step 2: Create the chart with defined properties and bind it to the DOM element.
//Step 3: Add the CandleStick Series.
//Step 4: Set the data and render.
//Step5 : Plug the socket to the chart

//Code
const log = console.log;

const chartProperties = {
  width: 1500,
  height: 600,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
};

const domElement = document.getElementById("tvchart");
const chart = LightweightCharts.createChart(domElement, chartProperties);
const candleSeries = chart.addCandlestickSeries();

fetch(
  `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`
)
  .then((res) => res.json())
  .then((items) => {
    const cdata = items.map((item) => {
      return {
        time: item[0] / 1000,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      };
    });
    candleSeries.setData(cdata);
  })
  .catch((err) => log(err));

// Dynamic Chart
const socket = io.connect('http://localhost:4000/');

socket.on('KLINE',(pl)=>{
  //log(pl);
  candleSeries.update(pl);
});
