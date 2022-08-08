const HANDLE_LENGHT = 20;
const CUP_WIDTH_MAX = 60;
const CUP_WIDTH_MIN = 20;
const CUP_LH_DEPTH_PER = 0.3;
const TOLERANCE_PER = 0.1;
const LH_RH_PER = 0.6;

const curIndex = __INPUT.cursorIndex;
const close = __INPUT.close;
const date = __INPUT.date; 

let rightHigh = 0;
let rightHighDay = curIndex;
let leftHigh = close[curIndex];
let leftHighDay = curIndex;
let lowest = close[curIndex]; 
let lowestDay = curIndex;

for (let i=curIndex-CUP_WIDTH_MAX; i<=curIndex; i++) {
  // find left high
  if (leftHigh<close[i]) {
    leftHigh=close[i];
    leftHighDay = i;
  }
  
  // find lowest
  if (lowest>close[i]) {
    lowest = close[i];
    lowestDay = i;
  }

  // find right high
  if (rightHigh<close[i] && i>lowestDay) {
    rightHigh=close[i];
    rightHighDay = i;
  }
  
  // try to find the closest lowest point's left high
  if (leftHighDay<lowestDay 
        && lowestDay<rightHighDay 
        && (rightHighDay-leftHighDay) < CUP_WIDTH_MIN
        && Math.abs(leftHigh-rightHigh)/leftHigh < TOLERANCE_PER) {
     rightHigh = 0;
     leftHigh = close[rightHighDay];
     leftHighDay = rightHighDay;
     lowest = close[rightHighDay]; 
     lowestDay = rightHighDay; 
  }
  
}

if (leftHighDay<lowestDay 
       && lowestDay<rightHighDay 
       && leftHigh>lowest
       && rightHigh>lowest
       && leftHigh>rightHigh
       && rightHighDay-leftHighDay > CUP_WIDTH_MIN
       && (leftHigh-lowest)/leftHigh > CUP_LH_DEPTH_PER
       && (rightHigh-lowest)/(leftHigh-lowest) > LH_RH_PER) {
  __OUTPUT = {
    "status"            : "FOUND",
    "startDate"         : date[leftHighDay],
    "endDate"           : date[rightHighDay],
    "leftOffsetDay"     : 5,
    "rightOffsetDay"    : 20,
    "outputAttrs": [
      {"name":"Left High Date", "value":date[leftHighDay]},
      {"name":"Lowest Date", "value":date[rightHighDay]},
      {"name":"Right High Date", "value":date[lowestDay]}
    ]
  }
} else {
  __OUTPUT = {"status":"NOT_FOUND"}
}