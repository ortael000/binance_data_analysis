// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints


let input_symbole_field = document.getElementById("input_symbole");
let input_interval_field = document.getElementById("input_interval");
let input_startTime_field = document.getElementById("input_startTime");
let input_endTime_field = document.getElementById("input_endTime");
let input_limit_field = document.getElementById("input_limit");
let nombre_interval_field = document.getElementById("nombre_interval");
let nombre_interval_traite = document.getElementById("interval_traite");

let analyse_MACD_button = document.getElementById("analyse_MACD_button");


let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
let submit_button = document.getElementById("submit_button");

let compteur =0;
let URL_T = [];
const interval_par_iteration = 500;
const MA_extense = 200;  // defini sur combien de bougie precedent on calcule la moyenne
const EMA_lenght_1 = 12;
const EMA_lenght_2 = 26;
const MACD_EMA_lenght = 9;

// on declare les constantes qui seront utilise pour la partie analyse des cas

const range_open_price = 0.0075; // l'interval (en % de la MA) en dehors duquel on considere que l'open price est en dessous ou au dessus de la MA100
const range_MACD = 0.0005; // l'interval (en % de la MA) en dehors duquel on considere que l'open price est en dessous ou au dessus de la MA100
const range_delta_MACD = 0.0005; // l'interval (en % de la MA) en dehors duquel on considere que le MACD est en dessous ou au dessus du MACD_EMA
const Nombre_occurence_delta_MACD = 5 // Si = X, on comparera les positions relatives de la MCAD et EMA MACD X bougie plus tot avec les meme positions a l'instant t pour idenfier un croisement
const Periode_croissance1 = 5; // Pour chaque cas, on analysera la croissance sur les X periodes suivantes pour en faire la moyenne
const Periode_croissance2 = 10; // Pour chaque cas, on analysera la croissance sur les X periodes suivantes pour en faire la moyenne
const start_analysis = Math.max(MA_extense,EMA_lenght_1,EMA_lenght_2)+Nombre_occurence_delta_MACD+1;


submit_button.addEventListener("click",async function(){


  //let table_html = "<tr>  <th> Open date </th> <th> Open time</th>  <th> Open</th>  <th> High</th>  <th> Low</th>  <th> Close</th>  <th> Volume</th>  <th> Close time</th>  <th> Quote asset volume</th>  <th> Number of trades</th>  <th> Taker buy base asset volume</th>  <th> Taker buy quote asset volume</th> </tr>";
  
  compteur =0;
  let title_table = [["Timestamp","Date","Hours","Open","High","Low","Close","Volume","Close time","Quote asset volume","Number of trades","Taker buy base asset volume","Taker buy quote asset volume","ignore","Moving average on "+MA_extense, "EMA on " + EMA_lenght_1, "EMA on " + EMA_lenght_2,"MACD","EMA MACD sur " + MACD_EMA_lenght, "OP vs MA", "MACD_vs_MA", "MACD - EMA -T","MACD - EMA", "croissance sur " + Periode_croissance1, "Highest sur " +Periode_croissance1, "Lowest sur" + Periode_croissance1]];
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
  nombre_interval_field.innerText = (nombre_interval_total);
  let nombre_iteration = Math.ceil(nombre_interval_total/interval_par_iteration);    // nombre de fois qu'on va faire appeler l'API

  URL_T = converttoURL (startTime_value, endTime_value, interval_par_iteration, interval_en_seconde, symbole_value, interval_value);

  let nombre_iteration_restante = nombre_iteration;

  while (nombre_iteration_restante >0 ) {   // dans ce while on appelle 10 fois (ou moins) l'API par boucle et on stock les donnes recus dans "final table" tant qu'il reste des iterations de l'API a lancer.

    data = await Promise.all ([Appelle_API(URL_T[compteur]),Appelle_API(URL_T[compteur + 1]),Appelle_API(URL_T[compteur + 2]),Appelle_API(URL_T[compteur + 3]),Appelle_API(URL_T[compteur + 4]),Appelle_API(URL_T[compteur + 5]),Appelle_API(URL_T[compteur + 6]),Appelle_API(URL_T[compteur + 7]),Appelle_API(URL_T[compteur + 8]),Appelle_API(URL_T[compteur + 9])]);

    for (let k=0; k< Math.min(10,nombre_iteration_restante); k++) {
  
      for (let i = 0; i < data[k].length; i++) {
      let ligne_table_result=[];
  
        for (let j=0; j<12; j++) {

            if (j==0) { 
              ligne_table_result[j] = data[k][i][j];
              ligne_table_result[j+1] =converttodate(data[k][i][j]);       // on convertit la donne "timestamp" en une ligne jour et une ligne heure, ce qui implique de creer une colonne supplementaire dans le tableau en resultat. D'ou le j+1 dans la suite de la boucle
              ligne_table_result[j+2] = converttohours (data[k][i][j]);
               
            }
            else {
              ligne_table_result[j+2]= data[k][i][j];
            }
          
        }

        final_table[i+(compteur+k)*500] = ligne_table_result;
        nombre_interval_traite.innerText = (i+(compteur+k)*500);  
      }

    }

    nombre_iteration_restante = nombre_iteration_restante -10
    compteur = compteur +10;
  }

  console.log("on affiche la table recupere depuis l'API");
  console.log(final_table);

  // Dans cet partie, on calcule la moyenne mobile sur les valeurs des opentimes (3 ieme colonne) et on la rajoute a la fin du tableu "final table"
  let average_table = [];
  console.log("on calcule la MA sur " + MA_extense);
  average_table = Moving_average(final_table,MA_extense);
  console.log(average_table);

  console.log("on a une average table de " + average_table.length + " lignes et une final_table de " + final_table.length + " lignes" );

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le moving average a la fin de chaque ligne du tableau
    final_table[i].push(average_table[i]);
  }
  //Fin de la partie sur la moyenne mobile
   
  // Dans cet partie on calcule le EMA (Exponential moving average) sur les periodes EMA_lenght_1 et EMA_lenght_2 sur les valeurs des opentimes (3 ieme colonne) et on les rajoute a la fin du tableu "final_table"
  let EMA_table1 =[];
  EMA_table1 = Calculate_EMA(final_table,EMA_lenght_1,3);

  console.log("table des EMA12 ");
  console.log(EMA_table1);

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le EMA1
    final_table[i].push(EMA_table1[i]);
  }

  let EMA_table2 =[];
  EMA_table2 = Calculate_EMA(final_table,EMA_lenght_2,3);

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le EMA2
    final_table[i].push(EMA_table2[i]);
  }
 //Fin de la partie sur l'EMA'

  //On rajoute le MACD
  for (let i = 0 ; i < final_table.length; i++){
      if(i < (Math.max(EMA_lenght_1,EMA_lenght_2)-1) ){
        final_table[i].push(0);
      } else{
        final_table[i].push(Number(final_table[i][15]-final_table[i][16]));
      }
  }
  //Fin du MACD

  // on rajoute l'EMA9 sur le MACD
  let MACD_EMA =[];
  MACD_EMA = Calculate_EMA_ALT(final_table,MACD_EMA_lenght,17,Math.max(EMA_lenght_1,EMA_lenght_2));

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
    final_table[i].push(MACD_EMA[i]);
  }
  // Fin de la partie EMA9 sur le MACD

  // on rajoute la comparaison open price vs MA
 let OPvsMA_table = [];
 OPvsMA_table= Analyse_Openprice_vs_MA (final_table,start_analysis,range_open_price);

 for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
  final_table[i].push(OPvsMA_table[i]);
}
  // fin de la comparaison open price vs MA

  // on rajoute la comparaison MACD vs MA
 let MACDvsMA_table = [];
 MACDvsMA_table= Analyse_MACD_vs_MA (final_table,start_analysis,range_MACD);

 for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
    final_table[i].push(MACDvsMA_table[i]);
  }
  // fin de la comparaison MACD vs MA


  // On rajout ensuite le MACD - son EMA (a T et T-5)#
  
  let EMA_MACD_vs_MACD_table1 =[];
  let EMA_MACD_vs_MACD_table2 =[];

  EMA_MACD_vs_MACD_table1 = EMA_MACD_vs_MACD (final_table,start_analysis,4,range_delta_MACD);
  EMA_MACD_vs_MACD_table2 = EMA_MACD_vs_MACD (final_table,start_analysis,0,range_delta_MACD);

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
    final_table[i].push(EMA_MACD_vs_MACD_table1[i]);
  }

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
    final_table[i].push(EMA_MACD_vs_MACD_table2[i]);
  }
  // Fin du MACD - son EMA

  // on rajoute le calcul de la croissance dans le futur du moment analyse
  
  let table_growth = []
  table_growth= growth_calculation (final_table,start_analysis,Periode_croissance1);

  console.log(table_growth);

  for (let i = 0; i < final_table.length; i++) {   // on rajoute le MACD_EMA
    final_table[i].push(table_growth[i][0]);
    final_table[i].push(table_growth[i][1]);
    final_table[i].push(table_growth[i][2]);
  }

    
  // Fin du rajoute de l'analyse de la croissance


  // on cree puis on download le CSV
  let Table_inCVS = arrayToCsv(title_table) +"\r\n"+ arrayToCsv(final_table); // "\r\n" permet un retour a la ligne entre les deux tableaux convertit en string
  console.log(Table_inCVS);
  downloadCsv(Table_inCVS,"binancedata");


});


analyse_MACD_button.addEventListener("click",async function(){

  Analyse_Openprice_vs_MA (final_table2,start)


});




              // declaration des fonctions


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
  
  if (URLinput == 1) { return [[]];}

  else {

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

}

function converttoURL (startTime_value, endTime_value, interval_par_iteration, interval_en_seconde, symbole_value, interval_value) // Une fonction qui prend en input les timesstemps de depart, le nombre de ligne max (generalement 500) et le nombre de seconde dans un intreval (ex 300 pour 5m) et renvoie un tableau avec les URL successifs a utiliser pour l'API.
{
  let result = [];
  let API= "";
  let nombre_interval_total = Math.floor(((endTime_value-startTime_value)/1000)/interval_en_seconde);   // nombre total de ligne qu'on souhaite appeler
  let nombre_iteration = Math.ceil(nombre_interval_total/interval_par_iteration);    // nombre de fois qu'on va faire tourner la boucle for
  let startTime_value2 = 0;

  for (let i = 0; i < nombre_iteration; i++) {

    startTime_value2 = startTime_value + (i*interval_par_iteration*interval_en_seconde*1000);

      API = "https://api.binance.com/api/v3/klines?symbol="+symbole_value+"&interval="+interval_value+"&startTime="+startTime_value2+"&endTime="+endTime_value+"&limit="+interval_par_iteration;
      
      result.push(API);
  }

  for (let i = 0; i < 10; i++) {
    result.push(1);

  }

  return result;
}

function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    // .map(v => v.replaceAll('"', '""'))  // escape double colons
    // .map(v => `"${v}"`)  // quote it
    .join(',')  // agregate all elements of a row of the tble with comma-separated in between
  ).join('\r\n');  // agregate all row of the table (that have previously been tranformed to one string each, with "\r\n" in between)
}

function downloadCsv(csv, filename) {
  const fakeLink = document.createElement('a');  // on cree un element "fakelink" 
  fakeLink.style.display = 'none'; 
  document.body.appendChild(fakeLink); // qu'on rattache ensuite au body du document
  const blob = new Blob([csv], { type: 'text/csv' }); // on creer ensuite l'element CSV avec Blob ( voir : https://developer.mozilla.org/fr/docs/Web/API/Blob )

  //if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //    // Manage IE11+ & Edge
  //    window.navigator.msSaveOrOpenBlob(blob, `${filename}.csv`);
  //} else {

      fakeLink.setAttribute('href', URL.createObjectURL(blob)); // on attribue au lien fakeLink la href de l'URL vers l'objet blop (qu'on cree au passage)
      fakeLink.setAttribute('download', `${filename}.csv`);   // on attribue au lien le fait d'etre un lien de telechargement du fichier tel qu'on l'a nomme en input, au format csv
      fakeLink.click();  // on simule le fait de cliquer sur le lien

  //}
};

function Moving_average (table,etendu){

  let table_average = [];
  for (let i = 0; i < table.length; i++) {
    table_average[i]= 0;

    if (i < (etendu))  {
    } else { 
        for (let j = 0; j < (etendu); j++) {
          table_average[i] = table_average[i] + Number(table[i-j][3]);
        }
        table_average[i] = (Math.round(table_average[i]))/etendu;
     }
  }
  return table_average;
};

function Calculate_EMA (table,etendu,indice){

  let table_EMA =[];

  for (let i = 0; i < table.length; i++) {
    table_EMA[i]= 0;
    
    if (i < (etendu-1)) { 
      
    } else if (i == (etendu-1)) {
        for (let j = 0; j < etendu; j++) {
          table_EMA[i] = table_EMA[i] + Number(table[i-j][indice]);
        }
        table_EMA[i] = (Math.round(table_EMA[i]))/etendu;

    } else if (i > (etendu-1)) { 
      table_EMA[i] = (Number(table[i][indice] * (2/(etendu +1))))+ (table_EMA[i-1] * (1-((2/(etendu +1)))) ) ;
     }
  } 
  return table_EMA;
};

function Calculate_EMA_ALT (table,etendu,indice,start){

  let table_EMA =[];

  for (let i = 0; i < table.length; i++) {
    table_EMA[i]= 0;
    
    if (i < (etendu+start-2)) { 
      
    } else if (i == (etendu+start-2)) {
        for (let j = 0; j < (etendu); j++) {
          table_EMA[i] = table_EMA[i] + Number(table[i-j][indice]);
        }
        console.log("indice = " + indice + "la somme des " + etendu + " premier MACD est " + table_EMA[i]);
        table_EMA[i] = (Math.round(table_EMA[i]))/etendu;

    } else if (i > (etendu+start-2)) { 
      table_EMA[i] = (Number(table[i][indice] * (2/(etendu +1))))+ (table_EMA[i-1] * (1-((2/(etendu +1)))) ) ;
     }
  } 
  return table_EMA;
};

function Analyse_Openprice_vs_MA (table,start,range_open_price) {

  let table_Openprice_vs_MA =[];

  for (let i = 0; i < start; i++) {
    table_Openprice_vs_MA[i]= "";
  }

  for (let i = start; i < table.length; i++) {

    let testOPvsMA = (table[i][3]-table[i][14])/table[i][14];

    if (testOPvsMA < (-range_open_price)) { 
      table_Openprice_vs_MA[i] = "OP inferieur a la MA" ;
     } else if (testOPvsMA > (range_open_price)) {
      table_Openprice_vs_MA[i] = "OP superieur a la MA" ;
     } else  {
      table_Openprice_vs_MA[i] = "OP proche la MA" ;
    }
  }
  return table_Openprice_vs_MA;
};

function Analyse_MACD_vs_MA (table,start,range_MACD) {

  let table_MACD_vs_MA =[];

  for (let i = 0; i < start; i++) {
    table_MACD_vs_MA[i]= "";
  }

  for (let i = start; i < table.length; i++) {

    let testMACDvsMA = table[i][17]/table[i][14];

    if (testMACDvsMA < (-range_MACD)) { 
      table_MACD_vs_MA[i] = "MACD negatif" ;
     } else if (testMACDvsMA > (range_MACD)) {
      table_MACD_vs_MA[i] = "MACD positif" ;
     } else  {
      table_MACD_vs_MA[i] = "MACD neutre" ;
    }
  }
  return table_MACD_vs_MA;
};

function EMA_MACD_vs_MACD (table,start,decalage,range_delta_MACD) {
  
    let EMA_MACD_vs_MACD_table =[];

    for (let i = 0; i < start; i++) {
      EMA_MACD_vs_MACD_table[i]= "";
    }
  
    for (let i = start; i < table.length; i++) {
  
      let testMACDvsEMAMACD = (table[i-decalage][17]-table[i-decalage][18])/table[i-decalage][14];
  
      if (testMACDvsEMAMACD < (-range_delta_MACD)) { 
        EMA_MACD_vs_MACD_table[i] = "MACD inferieur a son EMA" ;
       } else if (testMACDvsEMAMACD > (range_delta_MACD)) {
        EMA_MACD_vs_MACD_table[i] = "MACD superieur a son EMA" ;
       } else  {
        EMA_MACD_vs_MACD_table[i] = "MACD proche de son EMA" ;
      }
    }
    return EMA_MACD_vs_MACD_table;
};

function growth_calculation (table,start,periode) {

let table_growth = [[]];



  for (let i = 0; i < start; i++) {
    let ligne_table = [];

    ligne_table[0]=0;
    ligne_table[1]=0;
    ligne_table[2]=0;

    table_growth[i] = ligne_table;

  }

  for (let i = start; i < (table.length- periode); i++) {  // on calcule la croissance en comparant la moyenne des high/low et close de la bougie T+periode a l'open de la bougie T
      let ligne_table = [];

      ligne_table[0]=Number(( (Number(table[i+periode][4])+Number(table[i+periode][5])+Number(table[i+periode][6]))/3 - Number(table[i][3]) ) / Number(table[i][3])) ;

      ligne_table[1]= table[i][4];
      for (let j = 1; j< (periode+1); j++ ){  // On recupere le plus haut de la periode analyse et on le compare a l'open price du debut de la periode
          let test1 = ligne_table[1];
          ligne_table[1] = Math.max(test1,table[i+j][4]);
      }
      ligne_table[1] = (ligne_table[1]-table[i][3])/table[i][3];

      ligne_table[2]= table[i][5];
      for (let j = 1; j< (periode+1); j++ ){ // On recupere le plus bas de la periode analyse et on le compare a l'open price du debut de la periode
          let test1 = ligne_table[2];
          ligne_table[2] = Math.min(test1,table[i+j][5]);
      }
      ligne_table[2] = (ligne_table[2]-table[i][3])/table[i][3];
      table_growth[i] = ligne_table;
  }

  for (let i = table.length- periode; i < table.length; i++) {
    let ligne_table = [];

    ligne_table[0]=0;
    ligne_table[1]=0;
    ligne_table[2]=0;

    table_growth[i] = ligne_table;

  }

  return table_growth;
}
