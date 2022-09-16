// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints
let result_table = [[]];

// On declare les differents elements de la page HTML en tant qu'element Javascrip

    // declaration des elements html de la partie "recuperation des donnees de l'API"
let input_symbole_field = document.getElementById("input_symbole");
let input_interval_field = document.getElementById("input_interval");
let input_startTime_field = document.getElementById("input_startTime");
let input_endTime_field = document.getElementById("input_endTime");
let input_limit_field = document.getElementById("input_limit");
let nombre_interval_field = document.getElementById("nombre_interval");
let nombre_interval_traite = document.getElementById("interval_traite");
let submit_button = document.getElementById("submit_button");

    // declaration des elements html de la partie "calcul des indicateurs"
let MA_extense1_input = document.getElementById("MA_extense1");  //  le champ d'input qui definit sur combien de bougie precedent on calcule la moyenne
let MA_extense2_input = document.getElementById("MA_extense2");
let EMA_lenght_1_input = document.getElementById("EMA_lenght_1"); //  le champ d'input qui definit sur combien de bougie precedent on calcule la moyenne exponentielle (la premiere)
let EMA_lenght_2_input = document.getElementById("EMA_lenght_2"); //  le champ d'input qui definit sur combien de bougie precedent on calcule la moyenne exponentielle (la seconde)
let MACD_EMA_lenght_input = document.getElementById("MACD_EMA_lenght"); // le champ d'input qui definit sur combien de bougie precedent on calcule la moyenne exponentielle (la seconde)
let Indicator_button = document.getElementById("Indicator_button");
let fin_indicateur_button = document.getElementById("fin_indicateur");

let strategy_button = document.getElementById("strategy_button");

// on declare les elements HTML lie a la simulation de trading
let simulate_button = document.getElementById("simulate_trading");
let start_capital_field = document.getElementById("start_capital");
let leverage_ratio_field = document.getElementById("leverage_ratio");

let launch_button = document.getElementById("launch_button");
let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
// Fin de la declaration des elements de la page HTML

let compteur =0;
const interval_par_iteration = 500;

let MA_extense1 = 0;
let MA_extense2 = 0;
let EMA_lenght_1 = 0;
let EMA_lenght_2 = 0;
let MACD_EMA_lenght = 0;

const start_analysis = Math.max(MA_extense1,MA_extense2,EMA_lenght_1,EMA_lenght_2)+1;

let title_table = [["Timestamp","Date","Hours","Open","High","Low","Close","Volume","Close time","Quote asset volume","Number of trades","Taker buy base asset volume","Taker buy quote asset volume","ignore"]];



submit_button.addEventListener("click",async function(){
  
  compteur =0;
  let data = [[]];
  let URL_T = [];

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
              
              ligne_table_result[j+2]= Math.floor(data[k][i][j]);
            }
          
        }

        result_table[i+(compteur+k)*500] = ligne_table_result;
        nombre_interval_traite.innerText = (i+(compteur+k)*500);  
      }

    }

    nombre_iteration_restante = nombre_iteration_restante -10
    compteur = compteur +10;
  }

  console.log("on affiche la table recupere depuis l'API");
  console.log(result_table);
});
  
Indicator_button.addEventListener("click",async function(){

  MA_extense1 = Number(MA_extense1_input.value);
  MA_extense2 = Number(MA_extense2_input.value);
  EMA_lenght_1 = Number(EMA_lenght_1_input.value);
  EMA_lenght_2 = Number(EMA_lenght_2_input.value);
  MACD_EMA_lenght = Number(MACD_EMA_lenght_input.value);

  title_table[0].push("Moving average on "+MA_extense1);
  title_table[0].push("Moving average on "+MA_extense2);
  title_table[0].push("EMA on " + EMA_lenght_1);
  title_table[0].push( "EMA on " + EMA_lenght_2);
  title_table[0].push("MACD");
  title_table[0].push("EMA MACD sur " + MACD_EMA_lenght);

  // Dans cet partie, on calcule la moyenne mobile sur les valeurs des opentimes (3 ieme colonne) et on la rajoute a la fin du tableu "final table"
  let average_table1 = [];
  
  average_table1 = Moving_average(result_table,MA_extense1);

  for (let i = 0; i < result_table.length; i++) {   // on rajoute le moving average a la fin de chaque ligne du tableau
    result_table[i].push(Math.floor(average_table1[i]*10)/10);
  }
  //Fin de la partie sur la moyenne mobile

  // Dans cet partie, on calcule la deuxieme moyenne mobile sur les valeurs des opentimes (3 ieme colonne) et on la rajoute a la fin du tableu "final table"
  let average_table2 = [];
  average_table2 = Moving_average(result_table,MA_extense2);

  
  for (let i = 0; i < result_table.length; i++) {   // on rajoute le moving average a la fin de chaque ligne du tableau
    result_table[i].push(Math.floor(average_table2[i]*10)/10);
  }
    //Fin de la partie sur la moyenne mobile
   
  // Dans cet partie on calcule le EMA (Exponential moving average) sur les periodes EMA_lenght_1 et EMA_lenght_2 sur les valeurs des opentimes (3 ieme colonne) et on les rajoute a la fin du tableu "result_table"
  let EMA_table1 =[];
  EMA_table1 = Calculate_EMA(result_table,EMA_lenght_1,3);

  for (let i = 0; i < result_table.length; i++) {   // on rajoute le EMA1
    result_table[i].push(Math.floor(EMA_table1[i]*10)/10);
  }

  let EMA_table2 =[];
  EMA_table2 = Calculate_EMA(result_table,EMA_lenght_2,3);

  for (let i = 0; i < result_table.length; i++) {   // on rajoute le EMA2
    result_table[i].push(Math.floor(EMA_table2[i]*10)/10);
  }
 //Fin de la partie sur l'EMA'

  //On rajoute le MACD
  for (let i = 0 ; i < result_table.length; i++){
      if(i < (Math.max(EMA_lenght_1,EMA_lenght_2)-1) ){
        result_table[i].push(0);
      } else{
        result_table[i].push(Math.floor(Number(result_table[i][16]-result_table[i][17])*10)/10);
      }
  }
  //Fin du MACD

  // on rajoute l'EMA-X sur le MACD
  let MACD_EMA =[];
  MACD_EMA = Calculate_EMA_ALT(result_table,MACD_EMA_lenght,18,Math.max(EMA_lenght_1,EMA_lenght_2));

  for (let i = 0; i < result_table.length; i++) {   // on rajoute le MACD_EMA
    result_table[i].push(Math.floor(MACD_EMA[i]*10)/10);
  }
  // Fin de la partie EMA-X sur le MACD
  console.log("Fin de la partie 2 sur le calcul des indicateurs");
  fin_indicateur_button.innerText =("Fin du calcul des indicateurs");
});

// partie definition de la strategie

// declaration des elements html de la partie "definition de la strategie"


strategy_button.addEventListener("click",async function(){


  // On declare les elements HTML cree pour remplir les parametres de la fonction, en tant qu'element JS
  let marge_tendance_input = document.getElementById("marge_tendance");
  let marge_MACD_input = document.getElementById("marge_MACD");
  let marge_stop_loss_input = document.getElementById("marge_stop_loss");
  let marge_gain_input = document.getElementById("marge_gain");

  // On recupere la valeur de ces parametres
  let marge_tendance_value = Number(marge_tendance_input.value);
  let marge_MACD_value = Number(marge_MACD_input.value);
  let marge_stop_loss_value = Number(marge_stop_loss_input.value);
  let marge_gain_value = Number(marge_gain_input.value);

  // On definit a partir de quel ligne du tableau on commence l'anayse
  console.log("On calcule le start a partir de " + EMA_lenght_1 + " "+ EMA_lenght_2 + " " + MACD_EMA_lenght + " " +MA_extense1 + " " + MA_extense1);
  let start2 = Math.max(Math.max(Number(EMA_lenght_1),Number(EMA_lenght_2)) + Number(MACD_EMA_lenght) , Math.max(Number(MA_extense1),Number(MA_extense1)));

  // On rajoute les nouveaux titres
  title_table[0].push("Opportunite de trading");
  title_table[0].push("Stop_loss");
  title_table[0].push("Get_gain");

  // on fait appelle a la fonction utilisant une strategie pour definir des opportunites de trade
  let strat_table = [[]];
  console.log("les parametres de la fonction sont " + start2 + " "+ marge_tendance_value + " " + marge_MACD_value + " " +marge_stop_loss_value + " " + marge_gain_value);
  strat_table= Strategy_MACD1(result_table,start2, marge_tendance_value, marge_MACD_value, marge_stop_loss_value, marge_gain_value);
  for (let i = 0; i < result_table.length; i++) {   // on rajoute le EMA1
    result_table[i].push(strat_table[i][0]);
    result_table[i].push(strat_table[i][1]);
    result_table[i].push(strat_table[i][2]);

  }

});

// Simulation de la strategie
simulate_button.addEventListener("click",async function(){

  let start_capital = Number(start_capital_field.value);
  let leverage_ratio = Number(leverage_ratio_field.value);
  let simulation_table = [[]];

  title_table[0].push("trade_execute");
  title_table[0].push("Resultat_trade");
  title_table[0].push("Trade on hold");
  title_table[0].push("Capital actuel");

  simulation_table = simultrade (result_table,start_capital,leverage_ratio);

  for (let i = 0; i < result_table.length; i++) {   // on rajoute le EMA1
    result_table[i].push(simulation_table[i][0]);
    result_table[i].push(simulation_table[i][1]);
    result_table[i].push(simulation_table[i][2]);
    result_table[i].push(simulation_table[i][3]);

  }

    // on cree puis on download le CSV
    let Table_inCVS = arrayToCsv(title_table) +"\r\n"+ arrayToCsv(result_table); // "\r\n" permet un retour a la ligne entre les deux tableaux convertit en string
    console.log(Table_inCVS);
    downloadCsv(Table_inCVS,"binancedata");
    // Fin de la creation du CSV

});
