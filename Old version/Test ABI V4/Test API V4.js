

// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints

let input_symbole_field = document.getElementById("input_symbole");
let input_interval_field = document.getElementById("input_interval");
let input_startTime_field = document.getElementById("input_startTime");
let input_endTime_field = document.getElementById("input_endTime");
let input_limit_field = document.getElementById("input_limit");
let nombre_interval_field = document.getElementById("nombre_interval");


let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
let submit_button = document.getElementById("submit_button")

let compteur =0;
let results_table = [];
const interval_par_iteration = 500;
let temp_table1 = [];

let table_html = "<tr>  <th> Open date </th> <th> Open time</th>  <th> Open</th>  <th> High</th>  <th> Low</th>  <th> Close</th>  <th> Volume</th>  <th> Close time</th>  <th> Quote asset volume</th>  <th> Number of trades</th>  <th> Taker buy base asset volume</th>  <th> Taker buy quote asset volume</th> </tr>";

submit_button.addEventListener("click",async function(){

  compteur =0;
  let final_table = [[]];
  let data = [[]];

    console.log("go1");

    let symbole_value = input_symbole_field.value ;
    let interval_value =input_interval_field.value ;
    let original_starttime_value = input_startTime_field.value*1000
    let startTime_value = original_starttime_value ;
    let endTime_value = input_endTime_field.value*1000 ;


    let interval_en_seconde = convertinsecond(interval_value);

    let nombre_interval_total = Math.floor(((endTime_value-startTime_value)/1000)/interval_en_seconde);
    let nombre_interval_restant = nombre_interval_total;

    nombre_interval_field.innerText = (nombre_interval_total);


    console.log("chaque interval est de "+ interval_value + " soit " + interval_en_seconde + " seconde");
    console.log("on a en tout "+ nombre_interval_total+ " ligne a extraire");

    while (nombre_interval_restant > 0 ) {

      startTime_value = original_starttime_value + (compteur*interval_par_iteration*interval_en_seconde*1000);

      let url_API = "https://api.binance.com/api/v3/klines?symbol="+symbole_value+"&interval="+interval_value+"&startTime="+startTime_value+"&endTime="+endTime_value+"&limit="+interval_par_iteration;
      data = await Appelle_API(url_API);

      console.log("test2 "+ data[1][1]);

      nombre_interval_compte = Math.min(nombre_interval_restant,interval_par_iteration);
      console.log(nombre_interval_compte);

      for (let i = 0; i < nombre_interval_compte; i++) {
        let ligne_table_result=[];

        for (let j=0; j<12; j++) {
          ligne_table_result[j]= data[i][j];
        }
        final_table[i+compteur*500] = ligne_table_result;
      }

      ++compteur;
      nombre_interval_restant = nombre_interval_restant -interval_par_iteration;

    }

  console.log(final_table);
   
  
   console.log("On test " + converttodate(final_table[1][0]));
   console.log("le tableau comporte le nombre de ligne " + final_table.length);

    for (let i = 0; i < final_table.length; i++) { 
      table_html = table_html + " <tr>  <th> "+converttodate(final_table[i][0])+"</th> <th> "+converttohours(final_table[i][0])+"</th>  <th> "+ Math.round(final_table[i][1]*100,1)/100+"</th>  <th> "+Math.round(final_table[i][2]*100,1)/100+"</th>  <th> "+Math.round(final_table[i][3]*100,1)/100+"</th>  <th> "+Math.round(final_table[i][4]*100,1)/100+"</th>  <th> "+Math.round(final_table[i][5]*100,1)/100+"</th>  <th> "+converttohours(final_table[i][6])+"</th>  <th> "+Math.round(final_table[i][7]*100,1)/100+"</th>  <th> "+final_table[i][8]+"</th>  <th> "+Math.round(final_table[i][9]*100,1)/100+"</th>  <th> "+Math.round(final_table[i][10]*100,1)/100+"</th> </tr>"
    }

    answer_field1.innerHTML = "<table>" + table_html + "</table>";

 
});




 function convertinsecond(timeinput) {   // Convertit l'input envoye a l'API binance concernant le temps entre chaque interval (ex : 15m) en nombre de seconde
          let resustat1 = 0;
          if (timeinput == "1m") { 
            resustat1 = 60;
           } else if (timeinput == "3m") {
            resustat1 = 180;
           } else if (timeinput == "5m") {
            resustat1 = 300;
          } else if (timeinput == "15m") {
            resustat1 = 900;
          } else if (timeinput == "30m") {
            resustat1 = 1800;
          } else if (timeinput == "1h") {
            resustat1 = 3600;
          }
          return resustat1;
 }

 function converttodate (timestamp) { // convertit un timestamp en une date (string)

    let date = new Date(timestamp).toLocaleDateString("en-GB");
  return date ;

 }

 function converttohours(timestamp){

  let hours = new Date(timestamp).toLocaleTimeString("en-GB");
  return hours;
 }

function Appelle_API(URLinput) {      // une fonction qui appelle l'API binanc
  

  return fetch(URLinput)   //"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=10000"
  .then(function(res) {
      if (res.ok) {
      return res.json();
    }
  })
  .then(function(jsonfile) {  

    return jsonfile;

    })  

  .catch(function(err) {
    // Une erreur est survenue
  });

}