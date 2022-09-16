
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

