
function Strategy_MACD1 (table,start, marge_tendance, marge_MACD, stop_loss_marge, gain_marge){   // marge_tendance, marge_MACD, stop_loss_marge et gain_marge sont exprimes en % du close price

  console.log(table.length);

  let strat_table = [[0,0,0,0,0,0]];

  for (let i = 1; i < start; i++) {
    strat_table.push([0,0,0,0,0,0]);
  }

  for (let i = start; i < table.length; i++) {

  
  // on commence par calculer les differentes variables declarees plus haut

    let abs_marge_tendance = marge_tendance * table[i][6]/100; // Ces marges servent a definir a partir de quel niveau d'ecart entre MA 200 et MA 100 on identifie une tendance
    let abs_marge_MACD = marge_MACD * table[i][6]/100; // Ces marges servent a definir a partir de quel niveau d'ecart entre le MACD et son EMA on considere la chose significative
    

    let test_tendance = "initial";   // variable qui prend "up" si on est en tendance general de hausse, "down" si on est en tendance general de baisse et "flat" sinon
    let test_MACD_T0 = "initial"; // variable qui prend la valeur "up" si le MACD est en dessus de son EMA a l'instant T et "down" si il est en dessous
    let test_MACD_T1 = "initial"  // variable qui prend la valeur "up" si le MACD est en dessus de son EMA a l'instant T-1 et "down" si il est en dessous

    test_MACD_T1

    if ((table[i][15] - abs_marge_tendance) > table[i][14] ) {
        test_tendance = "up";
    } else if ((table[i][14] - abs_marge_tendance) > table[i][15] ) {
      test_tendance = "down";
    } else {
      test_tendance = "flat"
    }

    if ((table[i-1][18]-abs_marge_MACD) > table[i-1][19] ) {
      test_MACD_T1 = "up";
    } else if ((table[i-1][19]-abs_marge_MACD) > table[i-1][18] ) {
      test_MACD_T1 = "down";
    } else {
      test_MACD_T1 = "flat"
    }

    if ((table[i][18]-abs_marge_MACD) > table[i][19] ) {
      test_MACD_T0 = "up";
    } else if ((table[i][19]-abs_marge_MACD)  > table[i][18] ) {
      test_MACD_T0 = "down";
    }else {
      test_MACD_T0 = "flat"
    }


  // on utilise ensuite ces variables pour identifier les cas ou on veut faire un trade
      
    if ((test_tendance == "up") && (test_MACD_T1 == "down") && (test_MACD_T0 == "up") ) { 
      strat_table.push([1 , ((1-stop_loss_marge/100)*table[i][6]) , ((1+gain_marge/100)*table[i][6])]);

    } else if ((test_tendance == "down") && (test_MACD_T1 == "up") && (test_MACD_T0 == "down") ) {
      strat_table.push([-1 , ((1+stop_loss_marge/100)*table[i][6]) , ((1-gain_marge/100)*table[i][6])]);
    } else {
      strat_table.push([0,0,0]);
    }
  }
  return strat_table;
};