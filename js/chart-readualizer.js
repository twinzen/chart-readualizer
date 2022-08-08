let __TABLE;
let outputDataSet = new Array();

function injectDetectionScript(){
  if ($('#injected-script')) 
    $('#injected-script').remove();
  $('body').append('<script id="injected-script" type="text/javascript">function detectCpuAndHandle (__INPUT) { '+$('#detection-script').val()+' ; collectOutputData(__OUTPUT); } <\/script>');
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function collectOutputData(outputData) {
  if(outputData.status == 'FOUND')
    outputDataSet.push(outputData);
}

function prepareChart(inputData, outputData) {
  if (outputData.status == 'FOUND') {
    startDay = inputData.date.indexOf(outputData.startDate);
    endDay = inputData.date.indexOf(outputData.endDate);
    finalStartDay = startDay-outputData.leftOffsetDay>=0?startDay-outputData.leftOffsetDay:0;
    finalEndDay = endDay+outputData.rightOffsetDay;
      

    renderChart(
          '',
          inputData.date.slice(finalStartDay,finalEndDay),
          inputData.close.slice(finalStartDay,finalEndDay),
          outputData.leftOffsetDay, 
          (endDay-startDay)+outputData.leftOffsetDay,
          outputData.outputAttrs);
  }
}

function renderChart(lable, labels, data, startDay, endDay, outputAttrs) {
  
  let suffix = uuidv4();
  
  //const chartCardHtml = '<div><canvas id="myChart'+suffix+'" width="300" height="200"></canvas></div>';
  
  let chartCardHtml = ''; 
  chartCardHtml += '<div class="col">';
  chartCardHtml += '    <div class="card">';
  chartCardHtml += '      <div class="card-body">';
  for (let i in outputAttrs) {
    chartCardHtml += '      <p class="card-text">'+outputAttrs[i].name+': '+outputAttrs[i].value+'</p>';  
  }
  chartCardHtml += '      </div>';
  chartCardHtml += '      <canvas id="myChart'+suffix+'"></canvas>';
  chartCardHtml += '    </div>';
  chartCardHtml += '  </div>';

  
  
  $('#chart-board').append(chartCardHtml);
  
  const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: lable,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: data,
        }],
      },
      options: {
        plugins :{ 
          legend: {display:false},
          annotation: {
            annotations: [{
               type: 'box',
               drawTime: 'beforeDatasetsDraw',
               xMin: startDay,
               xMax: endDay,
               backgroundColor: 'rgba(0, 255, 0, 0.2)',
               borderColor: 'rgb(0, 0, 0, 0)',
            }]
          }
        }
      }
  };
  
  console.error( $('#myChart'+suffix));
  
  const newChart = new Chart(
      $('#myChart'+suffix),
      config
  );
}

function resetData() {
  $('#chart-board').html('');
}

function rerun() {
  resetData();
  injectDetectionScript();
  
  let inputData = formatInputData(__TABLE);
  for(let i=0; i<=inputData.date.length; i++) {
    inputData.cursorIndex=i;
    inputData.cursorDate=inputData.date[i];
    detectCpuAndHandle(inputData);
  }
  if(outputDataSet.length > 0) {
    for (let i in outputDataSet) {
      prepareChart(inputData, outputDataSet[i])
    }
  } else {
    alert('No occurrence was detected.');
  }
}



function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    //console.log(contents);
    __TABLE = csvToArray(contents);
    //console.log(table);
    //refresh(table);
    //renderChart('A',table[0],table[4]);
    //rerun();
  };
  var csvText = reader.readAsText(file);
}

function formatInputData (table) {
  let inputData = {};
  inputData.date=table[0];
  inputData.open=table[1];
  inputData.high=table[2];
  inputData.low=table[3];
  inputData.close=table[4];
  inputData.adjClose=table[5];
  inputData.volume=table[6];
  return inputData; 
}


function csvToArray(str, delimiter = ",") {

  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
  var columns = new Array();
  
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
  console.log(rows.length);
  
  for (var i in rows) {
    const values = rows[i].split(delimiter);
    for (var j in values) {
      if (typeof columns[j] == 'undefined')
        columns[j]=new Array();
      columns[j].push(values[j])
  }
}

  return columns;
}