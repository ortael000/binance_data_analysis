

export function Moving_average (table,etendu){

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

export function Calculate_EMA (table,etendu,indice){

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

export function Calculate_EMA_ALT (table,etendu,indice,start){

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

export function Analyse_Openprice_vs_MA (table,start,range_open_price) {

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

export function Analyse_MACD_vs_MA (table,start,range_MACD) {

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

export function EMA_MACD_vs_MACD (table,start,decalage,range_delta_MACD) {
  
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

export function growth_calculation (table,start,periode) {

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


