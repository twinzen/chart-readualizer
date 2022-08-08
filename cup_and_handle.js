const HANDLE_MAX_LENGHT =10;
const HANDLE_MIN_LENGHT = 2;
const HANDLE_TOLERANCE_PER = 0.1;
const HANDLE_DEPTH = 0.1;
const CUP_WIDTH_MAX = 90;
const CUP_WIDTH_MIN = 20;
const CUP_LH_DEPTH_PER = 0.3;
const TOLERANCE_PER = 0.05;
const LH_RH_PER = 0.6;

const cursorIndex = __INPUT.cursorIndex;
const close = __INPUT.close;
const date = __INPUT.date; 

let rightHigh = close[cursorIndex];
let rightHighDay = cursorIndex;
let leftHigh;
let leftHighDay;
let lowest;
let lowestDay;

let isHandleFound = true;

// find the right high
for (let i=cursorIndex; i>=cursorIndex-HANDLE_MAX_LENGHT-1; i--) {
  if (rightHigh<=close[i]) {
    rightHigh=close[i];
    rightHighDay=i;
  }
}

for (let i=cursorIndex; i>=rightHighDay; i--) {
  if (close[cursorIndex]>close[i] ) {
    isHandleFound =false;
  }
}

if (cursorIndex-rightHighDay>=HANDLE_MAX_LENGHT
      || cursorIndex-rightHighDay<=HANDLE_MIN_LENGHT) {
  isHandleFound = false;
}

if (!isHandleFound) {
  __OUTPUT = {"status":"NOT_FOUND"}
} else {
  
  leftHigh = 0;
  leftHighDay = rightHighDay;
  lowest = rightHigh;
  lowestDay = rightHighDay;

  let isCupFound = true;
  
  for (let i=rightHighDay; i>=rightHighDay-CUP_WIDTH_MAX; i--) {
    
    // find lowest
    if (lowest>close[i]) {
      lowest = close[i];
      lowestDay = i;
    }
    
    if (leftHigh<close[i]) {
      leftHigh=close[i];
      leftHighDay = i;
    }
    
  }

  for (let i=rightHighDay; i>=lowestDay; i--) {
    if (close[i]>rightHigh) {
      isCupFound = false;
    } else if ((rightHigh-close[i] / rightHigh)>TOLERANCE_PER) {
      i//sCupFound = false;
    }
  }
  
  if (isCupFound 
         && leftHighDay<lowestDay 
         && leftHigh>lowest
         && rightHigh>lowest
         && leftHigh>rightHigh
         && rightHighDay-leftHighDay > CUP_WIDTH_MIN
         && (leftHigh-lowest)/leftHigh > CUP_LH_DEPTH_PER
         && (rightHigh-lowest)/(leftHigh-lowest) > LH_RH_PER) {
    __OUTPUT = {
      "status"            : "FOUND",
      "startDate"         : date[leftHighDay],
      "endDate"           : date[cursorIndex],
      "leftOffsetDay"     : 5,
      "rightOffsetDay"    : 100,
      "outputAttrs": [
        {"name":"Left High Date", "value":date[leftHighDay]},
        {"name":"Lowest Date", "value":date[lowestDay]},
        {"name":"Right High Date", "value":date[rightHighDay]},
        {"name":"Handle Date", "value":date[cursorIndex]}
      ]
    }
  } else {
    __OUTPUT = {"status":"NOT_FOUND"}
  }
  
}

