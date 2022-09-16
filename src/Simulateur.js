
function simultrade (table,start_capital,levier){   // marge_tendance, marge_MACD, stop_loss_marge et gain_marge sont exprimes en % du close price

  // Declation 


  // Declaration des variables qui seront utilises dans la fonction
  let trade_on_hold = "none";  // prend la valeur "long" si on long est en cours, la valeur "short" si un short est en cours et "none" sinon
  let current_stop_loss = 0; // Quand un trade est en cours, prend la valeur du stop loss du trade
  let current_take_gain = 0; // Quand un trade est en cours, prend la valeur du take gain du trade
  let current_currency = start_capital; // Montant de la monnaie de reference (Par exemple USDT) Prendra la valeur 0 si on fait un long. 
  let current_asset = 0; // Montant de l'asset que l'on possede sur le moment (par exemple BTC) prendra une valeur positif en cas de long, negative en cas de short et 0 si pas de trad een cours.
  let current_capital = start_capital; // Valeur total de notre portefeuille a l'instant T
  let trading_table = [[0,0,0]] // Tableau renvoye par la fonction avec trois colonnes 1) trade_execute ("short" "long" ou "0" qui indique si un trade a ete fait a la fin de cette bougie)
                                                                                //   2) Resultat_trade qui vient indique a posteriori la resultat du trade ( sur la ligne ou celui-ci a ete execute)
                                                                              //    3  Capital actuel indique la valeur du portefeuille a chaque ligne
  let colomn_start = table[0].length-1;  // Permet de definir l'indice du tableau a partir duquel on recupere l'info d'un opportunite de trade. Permet de prendre en compte les ajouts de nouveau indicateur dans le tableau. Cette logique implique en revanche que le resultat renvoye par la fonction "strategy" garde toujours la meme structure en trois colonnes.
  console.log(colomn_start);
  let indice_trade_on_hold = 0;


  for (let i = 0; i < table.length; i++) {
    trading_table.push([0,0,0]);

    
    if (trade_on_hold == "none")  {        //on commence par verifier si un trade est deja en cours ou non , si aucun n'est en cours, on peut tester pour voir si on doit en initier un ou non.

        if(table[i][colomn_start-2] == 1) { // On identifie qu'on doit ici realiser un long

          trade_on_hold = "long";
          indice_trade_on_hold = i;
          trading_table[i][0] = "start long";

          current_stop_loss = Number(table[i][colomn_start-1]);
          current_take_gain = Number(table[i][colomn_start]);

          current_asset = levier*current_currency/(table[i][6]);
          current_currency = (1-levier)*current_currency;

        } else if (table[i][colomn_start-2] == (-1)) {

          trade_on_hold = "short";
          indice_trade_on_hold = i;
          trading_table[i][0] = "start short";

          current_stop_loss = Number(table[i][colomn_start-1]);
          current_take_gain = Number(table[i][colomn_start]);

          current_asset = levier * (-current_currency/(table[i][6]));
          current_currency = current_currency + levier*current_currency;
          
        } else {

        }

    } else if (trade_on_hold == "long") {  // Dans le cas on un long est en cours, on verifie pour chaque ligne si on doit le close ou non.

        if (current_stop_loss >= Number(table[i][5])) {    // Dans le cas ou le low de la bougie est passe en dessous du stop loss, on close

          current_currency = current_currency + current_asset*current_stop_loss;

          trading_table[i][0] = "close long loss";
          trading_table[indice_trade_on_hold][1] = current_currency/trading_table[indice_trade_on_hold][3]

          current_asset =0;

          current_stop_loss =0;
          current_take_gain = 0;
          trade_on_hold = "none";

        } else if (current_take_gain <= Number(table[i][4])) { // Dans le cas ou le heigh de la bougie est passe au dessus 
        

          current_currency = current_currency + current_asset*current_take_gain;

          trading_table[i][0] = "close long gain";
          trading_table[indice_trade_on_hold][1] = current_currency/trading_table[indice_trade_on_hold][3]

          current_asset =0;

          current_stop_loss =0;
          current_take_gain = 0;
          trade_on_hold = "none";
        }

    } else if (trade_on_hold == "short") {

      
     if (current_stop_loss <= Number(table[i][4])) { // Dans le cas ou le heigh de la bougie est passe au dessus du stop loss on close 
      

          current_currency = current_currency + current_asset*current_stop_loss;
          current_asset =0;

          trading_table[i][0] = "close short loss";
          trading_table[indice_trade_on_hold][1] = current_currency/trading_table[indice_trade_on_hold][3]

          current_stop_loss =0;
          current_take_gain = 0;
          trade_on_hold = "none";

    } else if (current_take_gain >= Number(table[i][5])) {    // Dans le cas ou le low de la bougie est passe en dessous du take gain, on close

        current_currency = current_currency + current_asset*current_take_gain;
        current_asset =0;

        trading_table[i][0] = "close short gain";
        trading_table[indice_trade_on_hold][1] = current_currency/trading_table[indice_trade_on_hold][3]

        current_stop_loss =0;
        current_take_gain = 0;
        trade_on_hold = "none";
    }


    }

    current_capital = current_currency +  current_asset*(table[i][6]);
    trading_table[i][2] = trade_on_hold
    trading_table[i][3] = current_capital;
  }

  return trading_table;

};

function analyze_trade (table){   // marge_tendance, marge_MACD, stop_loss_marge et gain_marge sont exprimes en % du close price

  let colomn_start2 = table[0].length-1;

  let synthesis_table =[]

  let number_of_long_loss = 0;
  let number_of_long_gain = 0;
  let number_of_short_loss = 0;
  let number_of_short_gain = 0;

  for (let i = 0; i < table.length; i++) {
    
    if (table[i][colomn_start2-3] == "close long loss") {
      number_of_long_loss = number_of_long_loss+1;

    }else if (table[i][colomn_start2-3] == "close long gain")  {
      number_of_long_gain =number_of_long_gain +1;

    }else if (table[i][colomn_start2-3] == "close short loss") {
      number_of_short_loss = number_of_short_loss +1;
      
    }else if (table[i][colomn_start2-3] == "close short gain") {
      number_of_short_gain = number_of_short_gain +1;

    }
  }

  // synthesis_title_table = ["Benefice","Number of trade","Long", "Long gain", "Long loss", "Short", "Short gain", "Short loss"];
  synthesis_table[0] = Math.round((table[table.length-1][colomn_start2])/(table[0][colomn_start2])*1000)/1000;
  synthesis_table[1] = number_of_long_loss + number_of_long_gain + number_of_short_loss + number_of_short_gain;
  synthesis_table[2] = number_of_long_loss+number_of_long_gain;
  synthesis_table[3] = number_of_long_gain;
  synthesis_table[4] = number_of_long_loss;
  synthesis_table[5] = number_of_short_loss + number_of_short_gain;
  synthesis_table[6] = number_of_short_gain
  synthesis_table[7] = number_of_short_loss

  return synthesis_table;


};