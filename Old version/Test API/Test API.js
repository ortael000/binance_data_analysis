//https://github.com/binance/binance-public-data

let input_field1 = document.getElementById("input_test1");
let input1_value = input_field1.value
let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
let submit_button = document.getElementById("submit_button")
let compteur =0;


submit_button.addEventListener("click",function(){

    console.log("go1");

                                                                                            //https://data.binance.vision/data/spot/monthly/klines/BTCUSDT/1m/BTCUSDT-1m-2019-01.zip

    fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m&startTime=1641034800000&endTime=1641294000000&limit=500")   //"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=10000"
    .then(function(res) {
        if (res.ok) {
        return res.json();
      }
    })
    .then(function(jsonfile) {  

        console.log(jsonfile);
        console.log(jsonfile[0][1]);
      
    })
    .catch(function(err) {
      // Une erreur est survenue
    });

 
 });