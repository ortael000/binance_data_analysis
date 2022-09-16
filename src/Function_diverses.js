
              // declaration des fonctions


 export function convertinsecond(timeinput) {   // Convertit l'input envoye a l'API binance concernant le temps entre chaque interval (ex : 15m) en nombre de seconde
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

 export function converttodate (timestamp) { // convertit un timestamp en une date (string)

    let date = new Date(timestamp).toLocaleDateString("en-GB");
  return date ;

 }

 export function converttohours(timestamp){

  let hours = new Date(timestamp).toLocaleTimeString("en-GB");
  return hours;
 }

 export function Appelle_API(URLinput) {      // une fonction qui appelle l'API binanc
  
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

export function converttoURL (startTime_value, endTime_value, interval_par_iteration, interval_en_seconde, symbole_value, interval_value) // Une fonction qui prend en input les timesstemps de depart, le nombre de ligne max (generalement 500) et le nombre de seconde dans un intreval (ex 300 pour 5m) et renvoie un tableau avec les URL successifs a utiliser pour l'API.
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

export function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    // .map(v => v.replaceAll('"', '""'))  // escape double colons
    // .map(v => `"${v}"`)  // quote it
    .join(',')  // agregate all elements of a row of the tble with comma-separated in between
  ).join('\r\n');  // agregate all row of the table (that have previously been tranformed to one string each, with "\r\n" in between)
}

export function downloadCsv(csv, filename) {
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

export function convert_table_html (table) {  // fonction qui convertir une table js en un texte qui correspond au code pour creer la table en html

  let html_text = "<table> <tr>";

  for (let j = 0; j < table.length; j++) {  // Pour chaque autre ligne, on ajoute les elements en format hmtl

    html_text = html_text + " </tr>";

    for (let i = 0; i < table[0].length; i++) {

      html_text = html_text + " <td> " + table[j][i] + " </td> ";
    }

    html_text = html_text + " </tr>";
  }

  html_text = html_text + "<?table>";

  return html_text;

}

export function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

export function csvToArray2(csv, delimiter = ",", omitFirstRow = true) {
  console.log(csv.indexOf('\n'));
  return csv.slice(omitFirstRow ? csv.indexOf('\n') : 0)
            .split("\n")
            .map((element) => element.split(delimiter));
}
