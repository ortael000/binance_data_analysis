let input_field1 = document.getElementById("input_test1");
let input1_value = input_field1.value
let answer_field1 = document.getElementById("result_input1");
let answer_field2 = document.getElementById("result_input2");
let submit_button = document.getElementById("submit_button")
let compteur =0;


submit_button.addEventListener("click",function(){

    console.log("go");

    // Code pique sur internet pour aller chercher des donnees depuis l'API binance

    var burl ='https://api.binance.com';

    var query ='/api/v3/klines';
    
    query += '?symbol=BTCUSDT&interval=1m&limit=10';
    
    var url = burl + query;
    
    var ourRequest = new XMLHttpRequest();
    
    ourRequest.open('GET',url,true);
    ourRequest.onload = function(){
    console.log(ourRequest.responseText);
    }
    ourRequest.send();

     // Code pique sur internet pour aller chercher des donnees depuis l'API binance


    let testvar = ourRequest[1];

    console.log("testvar est " +testvar);

     // Code pique sur internet pour creer un fichier JSON a partir du tableau qu'on a recupere.

    var jsonfile = JSON.stringify(ourRequest);

    var fs = require('fs');
    fs.writeFile("thing.json", jsonfile, function(err, result) {
    if(err) console.log('error', err);
    });
    // Code pique sur internet pour creer un fichier JSON a partir du tableau qu'on a recupere.
 
 });