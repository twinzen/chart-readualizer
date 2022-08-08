const HANDLE_LENGHT = 20;
  const CUP_WIDTH_MAX = 60;
  const CUP_WIDTH_MIN = 20;
  const CUP_LH_DEPTH_PER = 0.3;
  const TOLERANCE_PER = 0.1;
  const LH_RH_PER = 0.6;
  
  
  let rightHigh = 0;
  let rightHighDay = startDay;
  let leftHigh = prices[startDay];
  let leftHighDay = startDay;
  let lowest = prices[startDay]; 
  let lowestDay = startDay;
  
  for (let i=startDay-CUP_WIDTH_MAX; i<=startDay; i++) {
    // find left high
    if (leftHigh<prices[i]) {
      leftHigh=prices[i];
      leftHighDay = i;
    }
    
    // find lowest
    if (lowest>prices[i]) {
      lowest = prices[i];
      lowestDay = i;
    }
  
    // find right high
    if (rightHigh<prices[i] && i>lowestDay) {
      rightHigh=prices[i];
      rightHighDay = i;
    }
    
    // reset if the cup width is too small
    if (leftHighDay<lowestDay 
          && lowestDay<rightHighDay 
          && (rightHighDay-leftHighDay) < CUP_WIDTH_MIN
          && Math.abs(leftHigh-rightHigh)/leftHigh < TOLERANCE_PER) {
       rightHigh = 0;
       leftHigh = prices[rightHighDay];
       leftHighDay = rightHighDay;
       lowest = prices[rightHighDay]; 
       lowestDay = rightHighDay; 
    }
    
  }
  
  
  let message = "Detected Day "+startDay+" / "+dates[startDay-CUP_WIDTH_MAX]+" to "+dates[startDay]+": Left-High="+dates[leftHighDay]+"("+leftHigh+"), Lowest="+dates[lowestDay]+"("+lowest+"), Right-High="+dates[rightHighDay]+"("+rightHigh+")";
  
  if (leftHighDay<lowestDay 
         && lowestDay<rightHighDay 
         && leftHigh>lowest
         && rightHigh>lowest
         && leftHigh>rightHigh
         && rightHighDay-leftHighDay > CUP_WIDTH_MIN
         && (leftHigh-lowest)/leftHigh > CUP_LH_DEPTH_PER
         && (rightHigh-lowest)/(leftHigh-lowest) > LH_RH_PER) {
    console.error(message);
    
    
    
    renderChart(''+dates[leftHighDay]+' to '+dates[rightHighDay],dates.slice(leftHighDay-5,rightHighDay+100),prices.slice(leftHighDay-5,rightHighDay+100));
  } else {
    console.log(message);
  }