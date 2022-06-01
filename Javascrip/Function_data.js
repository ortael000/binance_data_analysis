// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints
let data_table = [[]];

// On declare les differents elements de la page HTML en tant qu'element Javascrip

    // declaration des elements html de la partie "recuperation des donnees de l'API"
let input_symbole_field2 = document.getElementById("input_symbole");
let input_interval_field2 = document.getElementById("input_interval");
let input_startTime_field2 = document.getElementById("input_startTime");
let input_endTime_field2 = document.getElementById("input_endTime");
let input_limit_field2 = document.getElementById("input_limit");
let nombre_interval_field2 = document.getElementById("nombre_interval");
let nombre_interval_traite2 = document.getElementById("interval_traite");
let dlcsv_button = document.getElementById("dlcsv_button");

// on declare les elements html relatif a l'upload d'un CSV deja existant
let cvs_input = document.getElementById("csvfile");
let csv_input_form = document.getElementById("upload_csv_form");
let result_upload = document.getElementById("result_upload");

let afficher_data_button = document.getElementById("console_log_data");

// Fin de la declaration des elements de la page HTML

let compteur2 =0;
const interval_par_iteration2 = 500;
let csv_as_string ="";
let title_table2 = [["Timestamp","Date","Hours","Open","High","Low","Close","Volume","Close time","Quote asset volume","Number of trades","Taker buy base asset volume","Taker buy quote asset volume","ignore"]];



const reader = new FileReader(); // on definit le Filereader qu'on va utiliser ainsi que ses proprietes
reader.onload = function (e) {
  csv_as_string = e.target.result;
  
  
}

csv_input_form.addEventListener("submit",function(e){
  e.preventDefault();
  const input = cvs_input.files[0];
  reader.readAsText(input); 
  data_table = [[]];

  setTimeout(function() {
    const array = csvToArray2(csv_as_string);
    result_upload.innerText = ("Upload termine")

    for (let i=1; i< (array.length); i++) { 

      data_table[i-1]= (array[i]);
      data_table[i-1][13]= 0;

    }

    console.log(data_table);

  }, 150);

 
});

dlcsv_button.addEventListener("click",async function(){

  
  compteur2 =0;
  let data = [[]];
  let URL_T = [];
  data_table = [[]];

  console.log("go1");

  let symbole_value = input_symbole_field2.value ;
  let interval_value =input_interval_field2.value ;
  let original_starttime_value = input_startTime_field2.value*1000
  let startTime_value = original_starttime_value ;
  let endTime_value = input_endTime_field2.value*1000 ;


  let interval_en_seconde = convertinsecond(interval_value); 

  let nombre_interval_total = Math.floor(((endTime_value-startTime_value)/1000)/interval_en_seconde); 
  nombre_interval_field.innerText = (nombre_interval_total);
  let nombre_iteration = Math.ceil(nombre_interval_total/interval_par_iteration2);    // nombre de fois qu'on va faire appeler l'API

  URL_T = converttoURL (startTime_value, endTime_value, interval_par_iteration2, interval_en_seconde, symbole_value, interval_value);

  let nombre_iteration_restante = nombre_iteration;

  while (nombre_iteration_restante >0 ) {   // dans ce while on appelle 10 fois (ou moins) l'API par boucle et on stock les donnes recus dans "final table" tant qu'il reste des iterations de l'API a lancer.

    data = await Promise.all ([Appelle_API(URL_T[compteur2]),Appelle_API(URL_T[compteur2 + 1]),Appelle_API(URL_T[compteur2 + 2]),Appelle_API(URL_T[compteur2 + 3]),Appelle_API(URL_T[compteur2 + 4]),Appelle_API(URL_T[compteur2 + 5]),Appelle_API(URL_T[compteur2 + 6]),Appelle_API(URL_T[compteur2 + 7]),Appelle_API(URL_T[compteur2 + 8]),Appelle_API(URL_T[compteur2 + 9])]);

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

        data_table[i+(compteur2+k)*500] = ligne_table_result;
        nombre_interval_traite.innerText = (i+(compteur2+k)*500);  
      }

    }

    nombre_iteration_restante = nombre_iteration_restante -10
    compteur2 = compteur2 +10;
  }

  start_date_display.innerText = (converttodate(original_starttime_value));
  end_date_display.innerText = (converttodate(endTime_value));

  console.log("on affiche la table recupere depuis l'API");
  console.log(data_table);

  // on cree puis on download le CSV
  let Table_inCVS = arrayToCsv(title_table2) +"\r\n"+ arrayToCsv(data_table); // "\r\n" permet un retour a la ligne entre les deux tableaux convertit en string
  downloadCsv(Table_inCVS,"binancedata");
  // Fin de la creation du CSV

});

afficher_data_button.addEventListener("click",function(){

  console.log(data_table);
 
});

  
