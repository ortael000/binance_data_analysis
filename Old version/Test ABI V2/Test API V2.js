
// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints

let input_symbole_field = document.getElementById("input_symbole");
let input_interval_field = document.getElementById("input_interval");
let input_startTime_field = document.getElementById("input_startTime");
let input_endTime_field = document.getElementById("input_endTime");
let input_limit_field = document.getElementById("input_limit");


let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
let submit_button = document.getElementById("submit_button")

let compteur =0;
let results_table = [];

let table_html = "<tr>  <th> Open time</th>  <th> Open</th>  <th> High</th>  <th> Low</th>  <th> Close</th>  <th> Volume</th>  <th> Close time</th>  <th> Quote asset volume</th>  <th> Number of trades</th>  <th> Taker buy base asset volume</th>  <th> Taker buy quote asset volume</th>  <th> Ignore</th> </tr>";

submit_button.addEventListener("click",function(){

    console.log("go1");

    let symbole_value = input_symbole_field.value ;
    let interval_value =input_interval_field.value ;
    let startTime_value = input_startTime_field.value*1000 ;
    let endTime_value = input_endTime_field.value*1000 ;
    let limit_value = input_limit_field.value ;

    let url_API = "https://api.binance.com/api/v3/klines?symbol="+symbole_value+"&interval="+interval_value+"&startTime="+startTime_value+"&endTime="+endTime_value+"&limit="+limit_value
    console.log(url_API);


    fetch(url_API)   //"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=10000"
    .then(function(res) {
        if (res.ok) {
        return res.json();
      }
    })
    .then(function(jsonfile) {  

        console.log(jsonfile);
        console.log(jsonfile[0][1]);

      
        
        for (let i = 0; i < limit_value; i++) {
            table_html = table_html + " <tr>  <th> "+jsonfile[i][0]/1000+"</th>  <th> "+jsonfile[i][1]+"</th>  <th> "+jsonfile[i][2]+"</th>  <th> "+jsonfile[i][3]+"</th>  <th> "+jsonfile[i][4]+"</th>  <th> "+jsonfile[i][5]+"</th>  <th> "+jsonfile[i][6]+"</th>  <th> "+jsonfile[i][7]+"</th>  <th> "+jsonfile[i][8]+"</th>  <th> "+jsonfile[i][9]+"</th>  <th> "+jsonfile[i][10]+"</th>  <th> "+jsonfile[i][11]+"</th> </tr>"
        }
        answer_field1.innerHTML = "<table>" + table_html + "</table>";
    })

    


    .catch(function(err) {
      // Une erreur est survenue
    });

 
 });